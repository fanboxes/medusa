import { FindParams } from "../../common"

export interface AdminGetWorkflowExecutionsParams extends FindParams {
  /**
   * Filter by the ID of the transaction to retrieve workflow executions for a specific transaction.
   */
  transaction_id?: string | string[]
  /**
   * Filter by the ID of the workflow to retrieve workflow executions for a specific workflow.
   */
  workflow_id?: string | string[]
}
