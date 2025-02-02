import {
  IndexTypes,
  RemoteQueryFunction,
  SchemaObjectEntityRepresentation,
  Event,
} from "@medusajs/framework/types"
import { CommonEvents } from "@medusajs/framework/utils"

export class DataSynchronizer {
  #storageProvider: IndexTypes.StorageProvider
  #schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
  #query: RemoteQueryFunction

  constructor({
    storageProvider,
    schemaObjectRepresentation,
    query,
  }: {
    storageProvider: IndexTypes.StorageProvider
    schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
    query: RemoteQueryFunction
  }) {
    this.#storageProvider = storageProvider
    this.#schemaObjectRepresentation = schemaObjectRepresentation
    this.#query = query
  }

  async sync({
    entityName,
    pagination = {},
    ack,
  }: {
    entityName: string
    pagination?: {
      cursor?: string
      updated_at?: string | Date
      limit?: number
      batchSize?: number
    }
    ack: (ack: {
      lastCursor: string | null
      done?: boolean
      err?: Error
    }) => Promise<void>
  }) {
    const schemaEntityObjectRepresentation = this.#schemaObjectRepresentation[
      entityName
    ] as SchemaObjectEntityRepresentation

    const { fields, alias, moduleConfig } = schemaEntityObjectRepresentation

    const entityPrimaryKey = fields.find(
      (field) => !!moduleConfig.linkableKeys?.[field]
    )

    if (!entityPrimaryKey) {
      void ack({
        lastCursor: pagination.cursor ?? null,
        err: new Error(
          `Entity ${entityName} does not have a linkable primary key`
        ),
      })
      return
    }

    let processed = 0
    let currentCursor = pagination.cursor!
    const batchSize = pagination.batchSize ?? 1000
    const limit = pagination.limit ?? Infinity
    let done = false
    let error = null

    while (processed < limit || !done) {
      const filters: Record<string, any> = {}

      if (currentCursor) {
        filters[entityPrimaryKey] = { $gt: currentCursor }
      }

      if (pagination.updated_at) {
        filters["updated_at"] = { $gt: pagination.updated_at }
      }

      const { data } = await this.#query.graph({
        entity: alias,
        fields: [entityPrimaryKey],
        filters,
        pagination: {
          order: {
            [entityPrimaryKey]: "asc",
          },
          take: batchSize,
        },
      })

      done = !data.length
      if (done) {
        break
      }

      const envelop: Event = {
        data,
        name: `*.${CommonEvents.CREATED}`,
      }

      try {
        await this.#storageProvider.consumeEvent(
          schemaEntityObjectRepresentation
        )(envelop)
        currentCursor = data[data.length - 1][entityPrimaryKey]
        processed += data.length

        void ack({ lastCursor: currentCursor })
      } catch (err) {
        error = err
        break
      }
    }

    let acknoledgement: { lastCursor: string; done?: boolean; err?: Error } = {
      lastCursor: currentCursor,
      done: true,
    }

    if (error) {
      acknoledgement = {
        lastCursor: currentCursor,
        err: error,
      }
      void ack(acknoledgement)
      return acknoledgement
    }

    void ack(acknoledgement)
    return acknoledgement
  }
}
