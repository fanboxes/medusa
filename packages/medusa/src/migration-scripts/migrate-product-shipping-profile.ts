import {
  createRemoteLinkStep,
  createShippingProfilesStep,
  useQueryGraphStep,
} from "@medusajs/core-flows"
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createWorkflow } from "@medusajs/framework/workflows-sdk"

const assignProductsToShippingProfileWorkflow = createWorkflow(
  "assign-products-to-shipping-profile",
  () => {
    const { data: shippingProfiles } = useQueryGraphStep({
      entity: "shipping_profile",
      fields: ["id", "name"],
    }).config({ name: "get-shipping-profiles" })

    const { data: products } = useQueryGraphStep({
      entity: "product",
      fields: ["id"],
    }).config({ name: "get-products" })

    const shippingProfileId = transform(
      { shippingProfiles },
      ({ shippingProfiles }) =>
        shippingProfiles.find((sp) =>
          sp.name.toLocaleLowerCase().includes("default")
        )?.id ?? shippingProfiles[0]?.id
    )

    const createdShippingProfileId = when(
      "create-shipping-profile",
      {
        shippingProfileId,
      },
      ({ shippingProfileId }) => !shippingProfileId
    ).then(() => {
      const createdShippingProfiles = createShippingProfilesStep([
        {
          name: "Default Shipping Profile",
          type: "default",
        },
      ])

      return createdShippingProfiles[0].id
    })

    const links = transform(
      { products, shippingProfileId, createdShippingProfileId },
      ({ products, shippingProfileId, createdShippingProfileId }) => {
        return products.map((product) => ({
          [Modules.PRODUCT]: {
            product_id: product.id,
          },
          [Modules.FULFILLMENT]: {
            shipping_profile_id: shippingProfileId ?? createdShippingProfileId,
          },
        }))
      }
    )

    createRemoteLinkStep(links)

    return new WorkflowResponse(void 0)
  }
)

export default async function assignProductsToShippingProfile({
  container,
}: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("Assigning products to shipping profile")

  await assignProductsToShippingProfileWorkflow(container)
    .run()
    .then(() => {
      logger.info("Products assigned to shipping profile")
    })
    .catch((e) => {
      logger.error(e)
    })
}
