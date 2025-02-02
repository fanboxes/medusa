import { asValue } from "awilix"
import { container } from "@medusajs/framework"
import type { IndexTypes } from "@medusajs/types"
import { Orchestrator } from "../../src/orchestrator"

function creatingFakeLockingModule() {
  return {
    lockEntities: new Set(),
    acquire(key: string) {
      if (this.lockEntities.has(key)) {
        throw new Error("Lock already exists")
      }
      this.lockEntities.add(key)
    },
    release(key: string) {
      this.lockEntities.delete(key)
    },
  }
}

describe("Orchestrator", () => {
  test("process each entity via the task runner", async () => {
    const processedEntities: string[] = []
    const lockingModule = creatingFakeLockingModule()

    const entities: IndexTypes.SchemaObjectEntityRepresentation[] = [
      {
        entity: "brand",
        alias: "brand",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
      {
        entity: "product",
        alias: "product",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
    ]

    container.register({
      locking: asValue(lockingModule),
    })

    const orchestrator = new Orchestrator(container, entities, {
      lockDuration: 60 * 1000,
      async taskRunner(entity) {
        expect(orchestrator.state).toEqual("processing")
        processedEntities.push(entity.entity)
      },
    })

    await orchestrator.process()
    expect(lockingModule.lockEntities.size).toEqual(0)
    expect(orchestrator.state).toEqual("completed")
    expect(processedEntities).toEqual(["brand", "product"])
  })

  test("do not process tasks when unable to acquire lock", async () => {
    const processedEntities: string[] = []
    const lockingModule = creatingFakeLockingModule()

    const entities: IndexTypes.SchemaObjectEntityRepresentation[] = [
      {
        entity: "brand",
        alias: "brand",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
      {
        entity: "product",
        alias: "product",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
    ]

    container.register({
      locking: asValue({
        ...lockingModule,
        acquire() {
          throw new Error("Unable to acquire lock")
        },
      }),
    })

    const orchestrator = new Orchestrator(container, entities, {
      lockDuration: 60 * 1000,
      async taskRunner(entity) {
        processedEntities.push(entity.entity)
      },
    })

    await orchestrator.process()
    expect(processedEntities).toEqual([])
  })

  test("share tasks between multiple instances", async () => {
    const processedEntities: { owner: string; entity: string }[] = []
    const lockingModule = creatingFakeLockingModule()

    const entities: IndexTypes.SchemaObjectEntityRepresentation[] = [
      {
        entity: "brand",
        alias: "brand",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
      {
        entity: "product",
        alias: "product",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
    ]

    container.register({
      locking: asValue(lockingModule),
    })

    const orchestrator = new Orchestrator(container, entities, {
      lockDuration: 60 * 1000,
      async taskRunner(entity) {
        processedEntities.push({ entity: entity.entity, owner: "instance-1" })
      },
    })
    const orchestrator1 = new Orchestrator(container, entities, {
      lockDuration: 60 * 1000,
      async taskRunner(entity) {
        processedEntities.push({ entity: entity.entity, owner: "instance-2" })
      },
    })

    await Promise.all([orchestrator.process(), orchestrator1.process()])
    expect(processedEntities).toEqual([
      {
        entity: "brand",
        owner: "instance-1",
      },
      {
        entity: "product",
        owner: "instance-2",
      },
    ])
    expect(lockingModule.lockEntities.size).toEqual(0)
  })

  test("stop processing when task runner throws error", async () => {
    const processedEntities: string[] = []
    const lockingModule = creatingFakeLockingModule()

    const entities: IndexTypes.SchemaObjectEntityRepresentation[] = [
      {
        entity: "brand",
        alias: "brand",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
      {
        entity: "product",
        alias: "product",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
    ]

    container.register({
      locking: asValue(lockingModule),
    })

    const orchestrator = new Orchestrator(container, entities, {
      lockDuration: 60 * 1000,
      async taskRunner(entity) {
        if (entity.entity === "product") {
          throw new Error("Cannot process")
        }
        processedEntities.push(entity.entity)
      },
    })

    await expect(orchestrator.process()).rejects.toThrow("Cannot process")
    expect(orchestrator.state).toEqual("error")
    expect(processedEntities).toEqual(["brand"])
    expect(lockingModule.lockEntities.size).toEqual(0)
  })

  test("throw error when the same instance is executed to process tasks parallely", async () => {
    const processedEntities: string[] = []
    const lockingModule = creatingFakeLockingModule()

    const entities: IndexTypes.SchemaObjectEntityRepresentation[] = [
      {
        entity: "brand",
        alias: "brand",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
      {
        entity: "product",
        alias: "product",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
    ]

    container.register({
      locking: asValue(lockingModule),
    })

    const orchestrator = new Orchestrator(container, entities, {
      lockDuration: 60 * 1000,
      async taskRunner(entity) {
        expect(orchestrator.state).toEqual("processing")
        processedEntities.push(entity.entity)
      },
    })

    await expect(
      Promise.all([orchestrator.process(), orchestrator.process()])
    ).rejects.toThrow("Cannot re-run an already running orchestrator instance")

    expect(lockingModule.lockEntities.size).toEqual(0)
  })
})
