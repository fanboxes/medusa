import {
  Context,
  DAL,
  InferEntityType,
  InternalModuleDeclaration,
  ModulesSdkTypes,
  WorkflowsSdkTypes,
} from "@medusajs/framework/types"
import {
  InjectSharedContext,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/framework/utils"
import type {
  ReturnWorkflow,
  UnwrapWorkflowInputDataType,
} from "@medusajs/framework/workflows-sdk"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { WorkflowExecution } from "@models"
import { WorkflowOrchestratorService } from "@services"

type InjectedDependencies = {
  manager: SqlEntityManager
  baseRepository: DAL.RepositoryService
  workflowExecutionService: ModulesSdkTypes.IMedusaInternalService<any>
  workflowOrchestratorService: WorkflowOrchestratorService
}

export class WorkflowsModuleService<
  TWorkflowExecution extends InferEntityType<
    typeof WorkflowExecution
  > = InferEntityType<typeof WorkflowExecution>
> extends ModulesSdkUtils.MedusaService<{
  WorkflowExecution: { dto: InferEntityType<typeof WorkflowExecution> }
}>({ WorkflowExecution }) {
  protected baseRepository_: DAL.RepositoryService
  protected workflowExecutionService_: ModulesSdkTypes.IMedusaInternalService<TWorkflowExecution>
  protected workflowOrchestratorService_: WorkflowOrchestratorService
  protected manager_: SqlEntityManager
  private clearTimeout_: NodeJS.Timeout

  constructor(
    {
      manager,
      baseRepository,
      workflowExecutionService,
      workflowOrchestratorService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.manager_ = manager
    this.baseRepository_ = baseRepository
    this.workflowExecutionService_ = workflowExecutionService
    this.workflowOrchestratorService_ = workflowOrchestratorService
  }

  __hooks = {
    onApplicationStart: async () => {
      await this.clearExpiredExecutions()

      this.clearTimeout_ = setInterval(async () => {
        await this.clearExpiredExecutions()
      }, 1000 * 60 * 60)
    },
    onApplicationShutdown: async () => {
      clearInterval(this.clearTimeout_)
    },
  }

  @InjectSharedContext()
  async run<TWorkflow extends string | ReturnWorkflow<any, any, any>>(
    workflowIdOrWorkflow: TWorkflow,
    options: WorkflowsSdkTypes.WorkflowOrchestratorRunDTO<
      TWorkflow extends ReturnWorkflow<any, any, any>
        ? UnwrapWorkflowInputDataType<TWorkflow>
        : unknown
    > = {},
    @MedusaContext() context: Context = {}
  ) {
    const ret = await this.workflowOrchestratorService_.run<
      TWorkflow extends ReturnWorkflow<any, any, any>
        ? UnwrapWorkflowInputDataType<TWorkflow>
        : unknown
    >(workflowIdOrWorkflow, options, context)

    return ret as any
  }

  @InjectSharedContext()
  async getRunningTransaction(
    workflowId: string,
    transactionId: string,
    @MedusaContext() context: Context = {}
  ) {
    return await this.workflowOrchestratorService_.getRunningTransaction(
      workflowId,
      transactionId,
      context
    )
  }

  @InjectSharedContext()
  async setStepSuccess(
    {
      idempotencyKey,
      stepResponse,
      options,
    }: {
      idempotencyKey: string | object
      stepResponse: unknown
      options?: Record<string, any>
    },
    @MedusaContext() context: Context = {}
  ) {
    return await this.workflowOrchestratorService_.setStepSuccess(
      {
        idempotencyKey,
        stepResponse,
        options,
      } as any,
      context
    )
  }

  @InjectSharedContext()
  async setStepFailure(
    {
      idempotencyKey,
      stepResponse,
      options,
    }: {
      idempotencyKey: string | object
      stepResponse: unknown
      options?: Record<string, any>
    },
    @MedusaContext() context: Context = {}
  ) {
    return await this.workflowOrchestratorService_.setStepFailure(
      {
        idempotencyKey,
        stepResponse,
        options,
      } as any,
      context
    )
  }

  @InjectSharedContext()
  async subscribe(
    args: {
      workflowId: string
      transactionId?: string
      subscriber: Function
      subscriberId?: string
    },
    @MedusaContext() context: Context = {}
  ) {
    return this.workflowOrchestratorService_.subscribe(args as any, context)
  }

  @InjectSharedContext()
  async unsubscribe(
    args: {
      workflowId: string
      transactionId?: string
      subscriberOrId: string | Function
    },
    @MedusaContext() context: Context = {}
  ) {
    return this.workflowOrchestratorService_.unsubscribe(args as any, context)
  }

  private async clearExpiredExecutions() {
    return this.manager_.execute(`
      DELETE FROM workflow_execution
      WHERE retention_time IS NOT NULL AND
      updated_at <= (CURRENT_TIMESTAMP - INTERVAL '1 second' * retention_time);
    `)
  }
}
