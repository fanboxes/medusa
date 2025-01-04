import { ProductCategoryWorkflow } from "@medusajs/framework/types"
import { ProductCategoryWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { createProductCategoriesStep } from "../steps"

export const createProductCategoriesWorkflowId = "create-product-categories"
/**
 * This workflow creates one or more product categories.
 */
export const createProductCategoriesWorkflow = createWorkflow(
  createProductCategoriesWorkflowId,
  (
    input: WorkflowData<ProductCategoryWorkflow.CreateProductCategoriesWorkflowInput>
  ) => {
    const createdProductCategories = createProductCategoriesStep(input)

    const productCategoryIdEvents = transform(
      { createdProductCategories },
      ({ createdProductCategories }) => {
        return createdProductCategories.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ProductCategoryWorkflowEvents.CREATED,
      data: productCategoryIdEvents,
    })

    const productCategoriesCreated = createHook("productCategoriesCreated", {
      createdProductCategories,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(createdProductCategories, {
      hooks: [productCategoriesCreated]
    })
  }
)
