import {
  configLoader,
  container,
  logger,
  MedusaAppLoader,
} from "@medusajs/framework"
import { MedusaAppOutput, MedusaModule } from "@medusajs/framework/modules-sdk"
import { IndexTypes, InferEntityType } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  toMikroORMEntity,
} from "@medusajs/framework/utils"
import { initDb, TestDatabaseUtils } from "@medusajs/test-utils"
import { asValue } from "awilix"
import * as path from "path"
import { DataSynchronizer } from "../../src/utils/sync/data-synchronizer"
import { EventBusServiceMock } from "../__fixtures__"
import { dbName } from "../__fixtures__/medusa-config"
import { EntityManager } from "@mikro-orm/postgresql"
import { IndexData, IndexRelation } from "@models"

const eventBusMock = new EventBusServiceMock()
const queryMock = {
  graph: jest.fn(),
}

const dbUtils = TestDatabaseUtils.dbTestUtilFactory()

jest.setTimeout(30000)

const testProductId = "test_prod_1"
const testProductId2 = "test_prod_2"
const testVariantId = "test_var_1"
const testVariantId2 = "test_var_2"

const mockData = [
  {
    id: testProductId,
    title: "Test Product",
    updated_at: new Date(),
  },
  {
    id: testProductId2,
    title: "Test Product",
    updated_at: new Date(),
  },
  {
    id: testVariantId,
    title: "Test Variant",
    product: {
      id: testProductId,
    },
    updated_at: new Date(),
  },
  {
    id: testVariantId2,
    title: "Test Variant 2",
    product: {
      id: testProductId2,
    },
    updated_at: new Date(),
  },
]

let medusaAppLoader!: MedusaAppLoader
let index!: IndexTypes.IIndexService

const beforeAll_ = async () => {
  try {
    await configLoader(
      path.join(__dirname, "./../__fixtures__"),
      "medusa-config"
    )

    console.log(`Creating database ${dbName}`)
    await dbUtils.create(dbName)
    dbUtils.pgConnection_ = await initDb()

    container.register({
      [ContainerRegistrationKeys.LOGGER]: asValue(logger),
      [ContainerRegistrationKeys.QUERY]: asValue(null),
      [ContainerRegistrationKeys.PG_CONNECTION]: asValue(dbUtils.pgConnection_),
    })

    medusaAppLoader = new MedusaAppLoader(container as any)

    // Migrations
    await medusaAppLoader.runModulesMigrations()
    const linkPlanner = await medusaAppLoader.getLinksExecutionPlanner()
    const plan = await linkPlanner.createPlan()
    await linkPlanner.executePlan(plan)

    // Clear partially loaded instances
    MedusaModule.clearInstances()

    // Bootstrap modules
    const globalApp = await medusaAppLoader.load()

    index = container.resolve(Modules.INDEX)

    // Mock event bus  the index module
    ;(index as any).eventBusModuleService_ = eventBusMock

    await globalApp.onApplicationStart()
    ;(index as any).storageProvider_.query_ = queryMock

    return globalApp
  } catch (error) {
    console.error("Error initializing", error?.message)
    throw error
  }
}

describe("DataSynchronizer", () => {
  let index: IndexTypes.IIndexService
  let dataSynchronizer: DataSynchronizer
  let medusaApp: MedusaAppOutput
  let onApplicationPrepareShutdown!: () => Promise<void>
  let onApplicationShutdown!: () => Promise<void>
  let manager: EntityManager

  beforeAll(async () => {
    medusaApp = await beforeAll_()
    onApplicationPrepareShutdown = medusaApp.onApplicationPrepareShutdown
    onApplicationShutdown = medusaApp.onApplicationShutdown
    manager = (
      medusaApp.sharedContainer!.resolve(ModuleRegistrationName.INDEX) as any
    ).container_.manager as EntityManager
  })

  afterAll(async () => {
    await onApplicationPrepareShutdown()
    await onApplicationShutdown()
    await dbUtils.shutdown(dbName)
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    index = container.resolve(Modules.INDEX)

    const productSchemaObjectRepresentation: IndexTypes.SchemaObjectEntityRepresentation =
      {
        fields: ["id", "title", "updated_at"],
        alias: "product",
        moduleConfig: {
          linkableKeys: {
            id: "Product",
            product_id: "Product",
            product_variant_id: "ProductVariant",
          },
        },
        entity: "Product",
        parents: [],
        listeners: ["product.created"],
      }

    const productVariantSchemaObjectRepresentation: IndexTypes.SchemaObjectEntityRepresentation =
      {
        fields: ["id", "title", "product.id", "updated_at"],
        alias: "product_variant",
        moduleConfig: {
          linkableKeys: {
            id: "ProductVariant",
            product_id: "Product",
            product_variant_id: "ProductVariant",
          },
        },
        entity: "ProductVariant",
        parents: [
          {
            ref: productSchemaObjectRepresentation,
            inSchemaRef: productSchemaObjectRepresentation,
            targetProp: "id",
          },
        ],
        listeners: ["product-variant.created"],
      }

    const mockSchemaRepresentation = {
      product: productSchemaObjectRepresentation,
      product_variant: productVariantSchemaObjectRepresentation,
    }

    dataSynchronizer = new DataSynchronizer({
      storageProvider: (index as any).storageProvider_,
      schemaObjectRepresentation: mockSchemaRepresentation,
      query: queryMock as any,
    })
  })

  describe("sync", () => {
    it("should sync products data correctly", async () => {
      // Mock query response for products
      queryMock.graph.mockImplementation(async (config) => {
        if (Array.isArray(config.filters.id)) {
          if (config.filters.id.includes(testProductId)) {
            return {
              data: [mockData[0]],
            }
          } else if (config.filters.id.includes(testProductId2)) {
            return {
              data: [mockData[1]],
            }
          }
        }

        if (Object.keys(config.filters).length === 0) {
          return {
            data: [mockData[0]],
          }
        } else if (config.filters.id["$gt"] === mockData[0].id) {
          return {
            data: [mockData[1]],
          }
        }

        return {
          data: [],
        }
      })

      const ackMock = jest.fn()

      const result = await dataSynchronizer.sync({
        entityName: "product",
        ack: ackMock,
      })

      // First loop fetching products
      expect(queryMock.graph).toHaveBeenNthCalledWith(1, {
        entity: "product",
        fields: ["id"],
        filters: {},
        pagination: {
          order: {
            id: "asc",
          },
          take: 1000,
        },
      })

      // First time fetching product data for creation from the storage provider
      expect(queryMock.graph).toHaveBeenNthCalledWith(2, {
        entity: "product",
        filters: {
          id: [testProductId],
        },
        fields: ["id", "title", "updated_at"],
      })

      // Second loop fetching products
      expect(queryMock.graph).toHaveBeenNthCalledWith(3, {
        entity: "product",
        fields: ["id"],
        filters: {
          id: {
            $gt: testProductId,
          },
        },
        pagination: {
          order: {
            id: "asc",
          },
          take: 1000,
        },
      })

      // Second time fetching product data for creation from the storage provider
      expect(queryMock.graph).toHaveBeenNthCalledWith(4, {
        entity: "product",
        filters: {
          id: [testProductId2],
        },
        fields: ["id", "title", "updated_at"],
      })

      expect(ackMock).toHaveBeenNthCalledWith(1, {
        lastCursor: testProductId,
      })

      expect(ackMock).toHaveBeenNthCalledWith(2, {
        lastCursor: testProductId2,
      })

      expect(ackMock).toHaveBeenNthCalledWith(3, {
        lastCursor: testProductId2,
        done: true,
      })

      expect(result).toEqual({
        lastCursor: testProductId2,
        done: true,
      })

      const indexData = await manager.find<InferEntityType<IndexData>>(
        toMikroORMEntity(IndexData),
        {}
      )
      const indexRelationData = await manager.find(
        toMikroORMEntity(IndexRelation),
        {}
      )

      expect(indexData).toHaveLength(2)
      expect(indexData[0].id).toEqual(testProductId)
      expect(indexData[1].id).toEqual(testProductId2)

      expect(indexRelationData).toHaveLength(0)
    })
  })

  it("should sync products and product variants data correctly", async () => {
    // Mock query response for products
    queryMock.graph.mockImplementation(async (config) => {
      if (config.entity === "product") {
        if (Array.isArray(config.filters.id)) {
          if (config.filters.id.includes(testProductId)) {
            return {
              data: [mockData[0]],
            }
          } else if (config.filters.id.includes(testProductId2)) {
            return {
              data: [mockData[1]],
            }
          }
        }

        if (Object.keys(config.filters).length === 0) {
          return {
            data: [mockData[0]],
          }
        } else if (config.filters.id["$gt"] === mockData[0].id) {
          return {
            data: [mockData[1]],
          }
        }
      }

      if (config.entity === "product_variant") {
        if (Array.isArray(config.filters.id)) {
          if (config.filters.id.includes(testVariantId)) {
            return {
              data: [mockData[2]],
            }
          } else if (config.filters.id.includes(testVariantId2)) {
            return {
              data: [mockData[3]],
            }
          }
        }

        if (Object.keys(config.filters).length === 0) {
          return {
            data: [mockData[2]],
          }
        } else if (config.filters.id["$gt"] === mockData[2].id) {
          return {
            data: [mockData[3]],
          }
        }
      }

      return {
        data: [],
      }
    })

    const ackMock = jest.fn()

    await dataSynchronizer.sync({
      entityName: "product",
      ack: ackMock,
    })

    jest.clearAllMocks()

    const result = await dataSynchronizer.sync({
      entityName: "product_variant",
      ack: ackMock,
    })

    // First loop fetching product variants
    expect(queryMock.graph).toHaveBeenNthCalledWith(1, {
      entity: "product_variant",
      fields: ["id"],
      filters: {},
      pagination: {
        order: {
          id: "asc",
        },
        take: 1000,
      },
    })

    // First time fetching product variant data for creation from the storage provider
    expect(queryMock.graph).toHaveBeenNthCalledWith(2, {
      entity: "product_variant",
      filters: {
        id: [testVariantId],
      },
      fields: ["id", "title", "product.id", "updated_at"],
    })

    // Second loop fetching product variants
    expect(queryMock.graph).toHaveBeenNthCalledWith(3, {
      entity: "product_variant",
      fields: ["id"],
      filters: {
        id: {
          $gt: testVariantId,
        },
      },
      pagination: {
        order: {
          id: "asc",
        },
        take: 1000,
      },
    })

    // Second time fetching product variant data for creation from the storage provider
    expect(queryMock.graph).toHaveBeenNthCalledWith(4, {
      entity: "product_variant",
      filters: {
        id: [testVariantId2],
      },
      fields: ["id", "title", "product.id", "updated_at"],
    })

    expect(ackMock).toHaveBeenNthCalledWith(1, {
      lastCursor: testVariantId,
    })

    expect(ackMock).toHaveBeenNthCalledWith(2, {
      lastCursor: testVariantId2,
    })

    expect(ackMock).toHaveBeenNthCalledWith(3, {
      lastCursor: testVariantId2,
      done: true,
    })

    expect(result).toEqual({
      lastCursor: testVariantId2,
      done: true,
    })

    const indexData = await manager.find<InferEntityType<IndexData>>(
      toMikroORMEntity(IndexData),
      {}
    )
    const indexRelationData = await manager.find<
      InferEntityType<IndexRelation>
    >(toMikroORMEntity(IndexRelation), {})

    expect(indexData).toHaveLength(4)
    expect(indexData[0].id).toEqual(testProductId)
    expect(indexData[1].id).toEqual(testProductId2)
    expect(indexData[2].id).toEqual(testVariantId)
    expect(indexData[3].id).toEqual(testVariantId2)

    expect(indexRelationData).toHaveLength(2)
    expect(indexRelationData[0]).toEqual(
      expect.objectContaining({
        parent_id: testProductId,
        child_id: testVariantId,
        parent_name: "Product",
        child_name: "ProductVariant",
        pivot: "Product-ProductVariant",
      })
    )
    expect(indexRelationData[1]).toEqual(
      expect.objectContaining({
        parent_id: testProductId2,
        child_id: testVariantId2,
        parent_name: "Product",
        child_name: "ProductVariant",
        pivot: "Product-ProductVariant",
      })
    )
  })

  // TODO: Add tests for errors handling and failure handling
})
