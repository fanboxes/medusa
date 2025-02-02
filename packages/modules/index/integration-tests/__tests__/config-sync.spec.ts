import {
  configLoader,
  container,
  logger,
  MedusaAppLoader,
} from "@medusajs/framework"
import { MedusaAppOutput, MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils"
import { initDb, TestDatabaseUtils } from "@medusajs/test-utils"
import { EntityManager } from "@mikro-orm/postgresql"
import { asValue } from "awilix"
import path from "path"
import { setTimeout } from "timers/promises"
import { EventBusServiceMock } from "../__fixtures__"
import { dbName } from "../__fixtures__/medusa-config"
import { updateRemovedSchema } from "../__fixtures__/update-removed-schema"
import { updatedSchema } from "../__fixtures__/updated-schema"

const eventBusMock = new EventBusServiceMock()
const queryMock = jest.fn().mockReturnValue({
  graph: jest.fn(),
})

const dbUtils = TestDatabaseUtils.dbTestUtilFactory()

jest.setTimeout(300000)

let isFirstTime = true
let medusaAppLoader!: MedusaAppLoader

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

    const index = container.resolve(Modules.INDEX)

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

const beforeEach_ = async () => {
  jest.clearAllMocks()

  if (isFirstTime) {
    isFirstTime = false
    return
  }

  try {
    await medusaAppLoader.runModulesLoader()
  } catch (error) {
    console.error("Error runner modules loaders", error?.message)
    throw error
  }
}

const afterEach_ = async () => {
  try {
    await dbUtils.teardown({ schema: "public" })
  } catch (error) {
    console.error("Error tearing down database:", error?.message)
    throw error
  }
}

describe("IndexModuleService syncIndexConfig", function () {
  let medusaApp: MedusaAppOutput
  let module: any
  let manager: EntityManager
  let onApplicationPrepareShutdown!: () => Promise<void>
  let onApplicationShutdown!: () => Promise<void>

  beforeAll(async () => {
    medusaApp = await beforeAll_()
    onApplicationPrepareShutdown = medusaApp.onApplicationPrepareShutdown
    onApplicationShutdown = medusaApp.onApplicationShutdown
  })

  afterAll(async () => {
    await onApplicationPrepareShutdown()
    await onApplicationShutdown()
    await dbUtils.shutdown(dbName)
  })

  beforeEach(async () => {
    await beforeEach_()

    module = medusaApp.sharedContainer!.resolve(ModuleRegistrationName.INDEX)
    manager = module.container_.manager as EntityManager
  })

  afterEach(afterEach_)

  it("should full sync all entities when the config has changed", async () => {
    await setTimeout(1000)

    const currentMetadata = await module.listIndexMetadata()

    expect(currentMetadata).toHaveLength(7)
    expect(currentMetadata).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: "InternalObject",
          fields: "b",
          status: "done",
        }),
        expect.objectContaining({
          entity: "Product",
          fields: "id,title",
          status: "done",
        }),
        expect.objectContaining({
          entity: "InternalNested",
          fields: "a",
          status: "done",
        }),
        expect.objectContaining({
          entity: "PriceSet",
          fields: "id",
          status: "done",
        }),
        expect.objectContaining({
          entity: "Price",
          fields: "amount,price_set.id",
          status: "done",
        }),
        expect.objectContaining({
          entity: "ProductVariant",
          fields: "id,product.id,product_id,sku",
          status: "done",
        }),
        expect.objectContaining({
          entity: "LinkProductVariantPriceSet",
          fields: "id,price_set_id,variant_id",
          status: "done",
        }),
      ])
    )

    // update config schema
    module.schemaObjectRepresentation_ = null
    module.moduleOptions_ ??= {}
    module.moduleOptions_.schema = updatedSchema
    module.buildSchemaObjectRepresentation_()

    const syncRequired = await module.syncIndexConfig()

    expect(syncRequired).toHaveLength(2)
    expect(syncRequired).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: "Product",
          fields: "handle,id,title",
          status: "pending",
        }),
        expect.objectContaining({
          entity: "Price",
          fields: "amount,currency_code,price_set.id",
          status: "pending",
        }),
      ])
    )

    const updatedMetadata = await module.listIndexMetadata()

    expect(updatedMetadata).toHaveLength(7)
    expect(updatedMetadata).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: "InternalObject",
          fields: "b",
          status: "done",
        }),
        expect.objectContaining({
          entity: "Product",
          fields: "handle,id,title",
          status: "pending",
        }),
        expect.objectContaining({
          entity: "InternalNested",
          fields: "a",
          status: "done",
        }),
        expect.objectContaining({
          entity: "PriceSet",
          fields: "id",
          status: "done",
        }),
        expect.objectContaining({
          entity: "Price",
          fields: "amount,currency_code,price_set.id",
          status: "pending",
        }),
        expect.objectContaining({
          entity: "ProductVariant",
          fields: "id,product.id,product_id,sku",
          status: "done",
        }),
        expect.objectContaining({
          entity: "LinkProductVariantPriceSet",
          fields: "id,price_set_id,variant_id",
          status: "done",
        }),
      ])
    )
    await module.syncEntities(syncRequired)

    // Sync again removing entities not linked
    module.schemaObjectRepresentation_ = null
    module.moduleOptions_ ??= {}
    module.moduleOptions_.schema = updateRemovedSchema
    module.buildSchemaObjectRepresentation_()

    const syncRequired2 = await module.syncIndexConfig()
    expect(syncRequired2).toHaveLength(1)
    expect(syncRequired2).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: "ProductVariant",
          fields: "description,id,product.id,product_id,sku",
          status: "pending",
        }),
      ])
    )

    const updatedMetadata2 = await module.listIndexMetadata()
    expect(updatedMetadata2).toHaveLength(5)
    expect(updatedMetadata2).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: "Product",
          fields: "handle,id,title",
          status: "done",
        }),
        expect.objectContaining({
          entity: "PriceSet",
          fields: "id",
          status: "done",
        }),
        expect.objectContaining({
          entity: "Price",
          fields: "amount,currency_code,price_set.id",
          status: "done",
        }),
        expect.objectContaining({
          entity: "ProductVariant",
          fields: "description,id,product.id,product_id,sku",
          status: "pending",
        }),
        expect.objectContaining({
          entity: "LinkProductVariantPriceSet",
          fields: "id,price_set_id,variant_id",
          status: "done",
        }),
      ])
    )
  })
})
