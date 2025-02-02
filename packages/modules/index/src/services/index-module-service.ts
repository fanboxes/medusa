import {
  Constructor,
  IEventBusModuleService,
  IndexTypes,
  InternalModuleDeclaration,
  ModulesSdkTypes,
  RemoteQueryFunction,
} from "@medusajs/framework/types"
import {
  MikroOrmBaseRepository as BaseRepository,
  ContainerRegistrationKeys,
  Modules,
  ModulesSdkUtils,
  simpleHash,
} from "@medusajs/framework/utils"
import { IndexMetadata } from "@models"
import { schemaObjectRepresentationPropertiesToOmit } from "@types"
import { buildSchemaObjectRepresentation } from "../utils/build-config"
import { defaultSchema } from "../utils/default-schema"
import { gqlSchemaToTypes } from "../utils/gql-to-types"
import { IndexMetadataStatus } from "../utils/index-metadata-status"

type InjectedDependencies = {
  [Modules.EVENT_BUS]: IEventBusModuleService
  storageProviderCtr: Constructor<IndexTypes.StorageProvider>
  [ContainerRegistrationKeys.QUERY]: RemoteQueryFunction
  storageProviderCtrOptions: unknown
  baseRepository: BaseRepository
  indexMetadataService: ModulesSdkTypes.IMedusaInternalService<any>
}

export default class IndexModuleService
  extends ModulesSdkUtils.MedusaService({
    IndexMetadata,
  })
  implements IndexTypes.IIndexService
{
  private readonly container_: InjectedDependencies
  private readonly moduleOptions_: IndexTypes.IndexModuleOptions

  protected readonly eventBusModuleService_: IEventBusModuleService

  protected schemaObjectRepresentation_: IndexTypes.SchemaObjectRepresentation
  protected schemaEntitiesMap_: Record<string, any>

  protected readonly storageProviderCtr_: Constructor<IndexTypes.StorageProvider>
  protected readonly storageProviderCtrOptions_: unknown

  protected storageProvider_: IndexTypes.StorageProvider

  private indexMetadataService_: ModulesSdkTypes.IMedusaInternalService<any>

  constructor(
    container: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    super(...arguments)

    this.container_ = container
    this.moduleOptions_ = (moduleDeclaration.options ??
      moduleDeclaration) as unknown as IndexTypes.IndexModuleOptions

    const {
      [Modules.EVENT_BUS]: eventBusModuleService,
      indexMetadataService,
      storageProviderCtr,
      storageProviderCtrOptions,
    } = container

    this.eventBusModuleService_ = eventBusModuleService
    this.storageProviderCtr_ = storageProviderCtr
    this.storageProviderCtrOptions_ = storageProviderCtrOptions
    this.indexMetadataService_ = indexMetadataService

    if (!this.eventBusModuleService_) {
      throw new Error(
        "EventBusModuleService is required for the IndexModule to work"
      )
    }
  }

  __hooks = {
    onApplicationStart(this: IndexModuleService) {
      return this.onApplicationStart_()
    },
  }

  protected async onApplicationStart_() {
    try {
      this.buildSchemaObjectRepresentation_()

      this.storageProvider_ = new this.storageProviderCtr_(
        this.container_,
        Object.assign(this.storageProviderCtrOptions_ ?? {}, {
          schemaObjectRepresentation: this.schemaObjectRepresentation_,
          entityMap: this.schemaEntitiesMap_,
        }),
        this.moduleOptions_
      ) as IndexTypes.StorageProvider

      this.registerListeners()

      if (this.storageProvider_.onApplicationStart) {
        await this.storageProvider_.onApplicationStart()
      }

      await gqlSchemaToTypes(this.moduleOptions_.schema ?? defaultSchema)

      const fullSyncRequired = await this.syncIndexConfig()
      if (fullSyncRequired.length > 0) {
        await this.syncEntities(fullSyncRequired)
      }
    } catch (e) {
      console.log(e)
    }
  }

  private async syncIndexConfig() {
    const schemaObjectRepresentation = (this.schemaObjectRepresentation_ ??
      {}) as IndexTypes.SchemaObjectRepresentation

    const currentConfig = await this.indexMetadataService_.list()
    const currentConfigMap = new Map(
      currentConfig.map((c) => [c.entity, c] as const)
    )

    type modifiedConfig = {
      id?: string
      entity: string
      fields: string[]
      fields_hash: string
      status?: IndexMetadataStatus
    }[]
    const entityPresent = new Set<string>()
    const newConfig: modifiedConfig = []
    const updatedConfig: modifiedConfig = []
    const deletedConfig: { entity: string }[] = []

    for (const [entityName, schemaEntityObjectRepresentation] of Object.entries(
      schemaObjectRepresentation
    )) {
      if (schemaObjectRepresentationPropertiesToOmit.includes(entityName)) {
        continue
      }

      const entity = schemaEntityObjectRepresentation.entity
      const fields = schemaEntityObjectRepresentation.fields.sort().join(",")
      const fields_hash = simpleHash(fields)

      const existingEntityConfig = currentConfigMap.get(entity)

      entityPresent.add(entity)
      if (
        !existingEntityConfig ||
        existingEntityConfig.fields_hash !== fields_hash
      ) {
        const meta = {
          id: existingEntityConfig?.id,
          entity,
          fields,
          fields_hash,
        }

        if (!existingEntityConfig) {
          newConfig.push(meta)
        } else {
          updatedConfig.push({
            ...meta,
            status: IndexMetadataStatus.PENDING,
          })
        }
      }
    }

    for (const [entity] of currentConfigMap) {
      if (!entityPresent.has(entity)) {
        deletedConfig.push({ entity })
      }
    }

    if (newConfig.length > 0) {
      await this.indexMetadataService_.create(newConfig)
    }
    if (updatedConfig.length > 0) {
      await this.indexMetadataService_.update(updatedConfig)
    }
    if (deletedConfig.length > 0) {
      await this.indexMetadataService_.delete(deletedConfig)
    }

    return await this.indexMetadataService_.list({
      status: [IndexMetadataStatus.PENDING, IndexMetadataStatus.PROCESSING],
    })
  }

  private async syncEntities(
    entities: {
      entity: string
      fields: string[]
      fields_hash: string
    }[]
  ) {
    const updatedStatus = async (
      entity: string,
      status: IndexMetadataStatus
    ) => {
      await this.indexMetadataService_.update({
        data: {
          status,
        },
        selector: {
          entity,
        },
      })
    }

    for (const entity of entities) {
      await updatedStatus(entity.entity, IndexMetadataStatus.PROCESSING)

      try {
        // await this.syncEntity(entity)

        await updatedStatus(entity.entity, IndexMetadataStatus.DONE)
      } catch (e) {
        await updatedStatus(entity.entity, IndexMetadataStatus.ERROR)
      }
    }
  }

  async query<const TEntry extends string>(
    config: IndexTypes.IndexQueryConfig<TEntry>
  ): Promise<IndexTypes.QueryResultSet<TEntry>> {
    return await this.storageProvider_.query(config)
  }

  protected registerListeners() {
    const schemaObjectRepresentation = (this.schemaObjectRepresentation_ ??
      {}) as IndexTypes.SchemaObjectRepresentation

    for (const [entityName, schemaEntityObjectRepresentation] of Object.entries(
      schemaObjectRepresentation
    )) {
      if (schemaObjectRepresentationPropertiesToOmit.includes(entityName)) {
        continue
      }

      ;(
        schemaEntityObjectRepresentation as IndexTypes.SchemaObjectEntityRepresentation
      ).listeners.forEach((listener) => {
        this.eventBusModuleService_.subscribe(
          listener,
          this.storageProvider_.consumeEvent(schemaEntityObjectRepresentation)
        )
      })
    }
  }

  private buildSchemaObjectRepresentation_() {
    if (this.schemaObjectRepresentation_) {
      return this.schemaObjectRepresentation_
    }

    const [objectRepresentation, entityMap] = buildSchemaObjectRepresentation(
      this.moduleOptions_.schema ?? defaultSchema
    )

    this.schemaObjectRepresentation_ = objectRepresentation
    this.schemaEntitiesMap_ = entityMap

    return this.schemaObjectRepresentation_
  }
}
