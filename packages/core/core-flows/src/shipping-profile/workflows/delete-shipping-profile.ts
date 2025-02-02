import {
  createStep,
  createWorkflow,
  WorkflowData,
} from "@medusajs/framework/workflows-sdk"
import { MedusaError, Modules } from "@medusajs/framework/utils"

import { deleteShippingProfilesStep } from "../steps"
import { removeRemoteLinkStep, useQueryGraphStep } from "../../common"

/**
 * This step validates that the shipping profiles to delete are not linked to any products.
 */
const validateStepShippingProfileDelete = createStep(
  "validate-step-shipping-profile-delete",
  (data: { links: { product_id: string; shipping_profile_id: string }[] }) => {
    const { links } = data

    if (links.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot delete following shipping profiles because they are linked to products: ${links
          .map((l) => l.product_id)
          .join(", ")}`
      )
    }
  }
)

/**
 * The data to delete shipping profiles.
 */
export type DeleteShippingProfilesWorkflowInput = {
  /**
   * The IDs of the shipping profiles to delete.
   */
  ids: string[]
}

export const deleteShippingProfileWorkflowId =
  "delete-shipping-profile-workflow"
/**
 * This workflow deletes one or more shipping profiles. It's used by the
 * [Delete Shipping Profile Admin API Route](https://docs.medusajs.com/api/admin#shipping-profiles_deleteshippingprofilesid).
 * Shipping profiles that are linked to products cannot be deleted.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete shipping profiles within your custom flows.
 *
 * @example
 * const { result } = await deleteShippingProfileWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["sp_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete shipping profiles.
 */
export const deleteShippingProfileWorkflow = createWorkflow(
  deleteShippingProfileWorkflowId,
  (input: WorkflowData<DeleteShippingProfilesWorkflowInput>) => {
    const currentShippingProfileLinks = useQueryGraphStep({
      entity: "product_shipping_profile",
      fields: ["product_id", "shipping_profile_id"],
      filters: { shipping_profile_id: input.ids },
    })

    validateStepShippingProfileDelete({
      links: currentShippingProfileLinks.data,
    })

    deleteShippingProfilesStep(input.ids)

    removeRemoteLinkStep({
      [Modules.FULFILLMENT]: { shipping_profile_id: input.ids },
    })
  }
)
