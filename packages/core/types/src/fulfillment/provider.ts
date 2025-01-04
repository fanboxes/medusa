import { CalculateShippingOptionPriceDTO } from "./mutations"

export type FulfillmentOption = {
  /**
   * The option's ID. This ID can be an ID in the third-party system relevant
   * for later processing of fulfillment.
   *
   * @example express
   */
  id: string
  /**
   * Whether the option can be used to return items.
   */
  is_return?: boolean
  [k: string]: unknown
}

export type CalculatedShippingOptionPrice = {
  /**
   * The calculated price.
   */
  calculated_amount: number
  /**
   * Whether the calculated price includes taxes. If enabled, Medusa will
   * infer the taxes from the calculated price. If false, Medusa will
   * add taxes to the calculated price.
   */
  is_calculated_price_tax_inclusive: boolean
}

export interface IFulfillmentProvider {
  /**
   *
   * Return a unique identifier to retrieve the fulfillment plugin provider
   */
  getIdentifier(): string
  /**
   *
   * Return the available fulfillment options for the given data.
   */
  getFulfillmentOptions(): Promise<FulfillmentOption[]>
  /**
   *
   * Validate the given fulfillment data.
   */
  validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<any>
  /**
   *
   * Validate the given option.
   */
  validateOption(data: Record<string, unknown>): Promise<boolean>
  /**
   *
   * Check if the provider can calculate the fulfillment price.
   */
  canCalculate(data: Record<string, unknown>): Promise<boolean>
  /**
   *
   * Calculate the price for the given fulfillment option.
   */
  calculatePrice(
    optionData: CalculateShippingOptionPriceDTO["optionData"],
    data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceDTO["context"]
  ): Promise<CalculatedShippingOptionPrice>
  /**
   *
   * Create a fulfillment for the given data.
   */
  createFulfillment(
    data: object,
    items: object[],
    order: object | undefined,
    fulfillment: Record<string, unknown>
  ): Promise<Record<string, unknown>>
  /**
   *
   * Cancel the given fulfillment.
   */
  cancelFulfillment(fulfillment: Record<string, unknown>): Promise<any>
  /**
   *
   * Get the documents for the given fulfillment data.
   */
  getFulfillmentDocuments(data: Record<string, unknown>): Promise<any>
  /**
   *
   * Create a return for the given data.
   */
  createReturnFulfillment(fromData: Record<string, unknown>): Promise<any>
  /**
   *
   * Get the documents for the given return data.
   */
  retrieveDocuments(
    fulfillmentData: Record<string, unknown>,
    documentType: string
  ): Promise<any>
  /**
   *
   * Get the documents for the given return data.
   */
  getReturnDocuments(data: Record<string, unknown>): Promise<any>
  /**
   *
   * Get the documents for the given shipment data.
   */
  getShipmentDocuments(data: Record<string, unknown>): Promise<any>
}
