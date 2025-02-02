import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { Filter as MikroORMFilter } from "@mikro-orm/core"
import { TSMigrationGenerator } from "@mikro-orm/migrations"
import { isString } from "../../common"
import { normalizeMigrationSQL } from "../utils"

type FilterDef = Parameters<typeof MikroORMFilter>[0]

export class CustomTsMigrationGenerator extends TSMigrationGenerator {
  // TODO: temporary fix to drop unique constraint before creating unique index
  private dropUniqueConstraintBeforeUniqueIndex(
    sqlPatches: string[],
    sql: string
  ) {
    // DML unique index
    const uniqueIndexName = sql.match(/"IDX_(.+?)_unique"/)?.[1]
    if (!uniqueIndexName) {
      return
    }

    // Add drop unique constraint if it exists, using the same name as index without IDX_ prefix
    const tableName = sql.match(/ON "(.+?)"/)?.[1]
    if (tableName) {
      sqlPatches.push(
        `alter table if exists "${tableName}" drop constraint if exists "${uniqueIndexName}_unique";`
      )
    }
  }

  generateMigrationFile(
    className: string,
    diff: { up: string[]; down: string[] }
  ): string {
    const sqlPatches: string[] = []
    for (const sql of diff.up) {
      this.dropUniqueConstraintBeforeUniqueIndex(sqlPatches, sql)
    }

    for (const sql of sqlPatches) {
      diff.up.unshift(sql)
    }

    return super.generateMigrationFile(className, diff)
  }

  createStatement(sql: string, padLeft: number): string {
    if (isString(sql)) {
      sql = normalizeMigrationSQL(sql)
    }

    return super.createStatement(sql, padLeft)
  }
}

export type Filter = {
  name?: string
} & Omit<FilterDef, "name">

export async function mikroOrmCreateConnection(
  database: ModuleServiceInitializeOptions["database"] & {
    connection?: any
    filters?: Record<string, Filter>
  },
  entities: any[],
  pathToMigrations: string
) {
  let schema = database.schema || "public"

  let driverOptions = database.driverOptions ?? {
    connection: { ssl: false },
  }

  let clientUrl = database.clientUrl

  if (database.connection) {
    // Reuse already existing connection
    // It is important that the knex package version is the same as the one used by MikroORM knex package
    driverOptions = database.connection
    clientUrl =
      database.connection.context?.client?.config?.connection?.connectionString
    schema = database.connection.context?.client?.config?.searchPath
  }

  const { MikroORM, defineConfig } = await import("@mikro-orm/postgresql")
  return await MikroORM.init(
    defineConfig({
      discovery: { disableDynamicFileAccess: true, warnWhenNoEntities: false },
      entities,
      debug: database.debug ?? process.env.NODE_ENV?.startsWith("dev") ?? false,
      baseDir: process.cwd(),
      clientUrl,
      schema,
      driverOptions,
      tsNode: process.env.APP_ENV === "development",
      filters: database.filters ?? {},
      assign: {
        convertCustomTypes: true,
      },
      migrations: {
        disableForeignKeys: false,
        path: pathToMigrations,
        generator: CustomTsMigrationGenerator,
        silent: !(
          database.debug ??
          process.env.NODE_ENV?.startsWith("dev") ??
          false
        ),
      },
      schemaGenerator: {
        disableForeignKeys: false,
      },
      pool: {
        min: 2,
        ...database.pool,
      },
    })
  )
}
