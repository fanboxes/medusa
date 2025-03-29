import {
  AdditionalData,
  BigNumberInput,
  CalculatedRMAShippingContext,
  CalculateShippingOptionPriceDTO,
  ShippingOptionDTO,
} from "@medusajs/framework/types"
import {
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { BigNumber, ShippingOptionPriceType } from "@medusajs/framework/utils"
import { calculateShippingOptionsPricesStep } from "../../fulfillment/steps"
import { useRemoteQueryStep } from "../../common"
import { pricingContextResult } from "../../cart/utils/schemas"

const COMMON_OPTIONS_FIELDS = [
  "id",
  "name",
  "price_type",
  "service_zone_id",
  "service_zone.fulfillment_set_id",
  "service_zone.fulfillment_set.type",
  "service_zone.fulfillment_set.location.*",
  "service_zone.fulfillment_set.location.address.*",
  "shipping_profile_id",
  "provider_id",
  "data",

  "type.id",
  "type.label",
  "type.description",
  "type.code",

  "provider.id",
  "provider.is_enabled",

  "rules.attribute",
  "rules.value",
  "rules.operator",
]

/**
 * The data to create a shipping method for an order edit.
 */
export type FetchShippingOptionForOrderWorkflowInput = {
  /**
   * The ID of the shipping option to create the shipping method from.
   */
  shipping_option_id: string
  /**
   * The custom amount to create the shipping method with.
   * If not provided, the shipping option's amount is used.
   */
  custom_amount?: BigNumberInput | null
  /**
   * The currency code of the order.
   */
  currency_code: string
  /**
   * The ID of the order.
   */
  order_id: string
  /**
   * The context of the order.
   */
  context: CalculatedRMAShippingContext
}

/**
 * The output of the fetch shipping option for order workflow.
 */
export type FetchShippingOptionForOrderWorkflowOutput = ShippingOptionDTO & {
  calculated_price: {
    calculated_amount: BigNumber
    is_calculated_price_tax_inclusive: boolean
  }
}
export const createOrderEditShippingMethodWorkflowId = "fetch-shipping-option"
/**
 * This workflows fetches a shipping option for an order (used in RMA flows).
 *
 * There can be 3 cases:
 * 1. The shipping option is a flat rate shipping option.
 *    In this case, pricing calculation context is not used.
 * 2. The shipping option is a calculated shipping option.
 *    In this case, calculate shipping price method from the provider is called.
 * 3. The shipping option is a custom shipping option. -- TODO
 *    In this case, we don't need to do caluclations above and just return the shipping option with the custom amount.
 */
export const fetchShippingOptionForOrderWorkflow = createWorkflow(
  createOrderEditShippingMethodWorkflowId,
  function (input: FetchShippingOptionForOrderWorkflowInput & AdditionalData) {
    const initialOption = useRemoteQueryStep({
      entry_point: "shipping_option",
      variables: { id: input.shipping_option_id },
      fields: ["id", "price_type"],
      list: false,
    }).config({ name: "shipping-option-query" })

    const isCalculatedPriceShippingOption = transform(
      initialOption,
      (option) => option.price_type === ShippingOptionPriceType.CALCULATED
    )

    const calculatedPriceShippingOption = when(
      "option-calculated",
      { isCalculatedPriceShippingOption },
      ({ isCalculatedPriceShippingOption }) => isCalculatedPriceShippingOption
    ).then(() => {
      const order = useRemoteQueryStep({
        entry_point: "orders",
        fields: ["id", "shipping_address", "items.*", "items.variant.*"],
        variables: { id: input.order_id },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "order-query" })

      const shippingOption = useRemoteQueryStep({
        entry_point: "shipping_option",
        fields: [...COMMON_OPTIONS_FIELDS],
        variables: { id: input.shipping_option_id },
        list: false,
      }).config({ name: "calculated-option" })

      const calculateShippingOptionsPricesData = transform(
        {
          shippingOption,
          order,
          input,
        },
        ({ shippingOption, order, input }) => {
          return [
            {
              id: shippingOption.id as string,
              optionData: shippingOption.data,
              context: {
                ...order,
                ...input.context,
                from_location:
                  shippingOption.service_zone.fulfillment_set.location,
              },
              // data: {}, // TODO: add data
              provider_id: shippingOption.provider_id,
            } as CalculateShippingOptionPriceDTO,
          ]
        }
      )

      const prices = calculateShippingOptionsPricesStep(
        calculateShippingOptionsPricesData
      )

      const shippingOptionsWithPrice = transform(
        {
          shippingOption,
          prices,
        },
        ({ shippingOption, prices }) => {
          return {
            id: shippingOption.id,
            name: shippingOption.name,
            calculated_price: prices[0],
          }
        }
      )

      return shippingOptionsWithPrice
    })

    const setPricingContext = createHook("setPricingContext", input, {
      resultValidator: pricingContextResult,
    })
    const setPricingContextResult = setPricingContext.getResult()
    const pricingContext = transform(
      { input, setPricingContextResult },
      (data) => {
        return {
          ...(data.setPricingContextResult ? data.setPricingContextResult : {}),
          currency_code: data.input.currency_code,
        }
      }
    )

    const flatRateShippingOption = when(
      "option-flat",
      { isCalculatedPriceShippingOption },
      ({ isCalculatedPriceShippingOption }) => !isCalculatedPriceShippingOption
    ).then(() => {
      const shippingOption = useRemoteQueryStep({
        entry_point: "shipping_option",
        fields: [
          "id",
          "name",
          "calculated_price.calculated_amount",
          "calculated_price.is_calculated_price_tax_inclusive",
        ],
        variables: {
          id: input.shipping_option_id,
          calculated_price: {
            context: pricingContext,
          },
        },
        list: false,
      }).config({ name: "flat-reate-option" })

      return shippingOption
    })

    const result: FetchShippingOptionForOrderWorkflowOutput = transform(
      {
        calculatedPriceShippingOption,
        flatRateShippingOption,
      },
      ({ calculatedPriceShippingOption, flatRateShippingOption }) => {
        return calculatedPriceShippingOption ?? flatRateShippingOption
      }
    )

    return new WorkflowResponse(result, { hooks: [setPricingContext] as const })
  }
)
