import { join } from "path"
import { dynamicImport, FileSystem } from "@medusajs/utils"

import { logger } from "../logger"
import type {
  MiddlewaresConfig,
  BodyParserConfigRoute,
  ScannedMiddlewareDescriptor,
} from "./types"

/**
 * File name that is used to indicate that the file is a middleware file
 */
const MIDDLEWARE_FILE_NAME = "middlewares"

const log = ({
  activityId,
  message,
}: {
  activityId?: string
  message: string
}) => {
  if (activityId) {
    logger.progress(activityId, message)
    return
  }

  logger.debug(message)
}

/**
 * Exposes the API to scan a directory and load the `middleware.ts` file. This file contains
 * the configuration for certain global middlewares and core routes validators. Also, it may
 * contain custom middlewares.
 */
export class MiddlewareFileLoader {
  /**
   * Middleware collected manually or by scanning directories
   */
  #middleware: ScannedMiddlewareDescriptor[] = []
  #bodyParserConfigRoutes: BodyParserConfigRoute[] = []

  /**
   * An eventual activity id for information tracking
   */
  readonly #activityId?: string

  constructor({ activityId }: { activityId?: string }) {
    this.#activityId = activityId
  }

  /**
   * Processes the middleware file and returns the middleware and the
   * routes config exported by it.
   */
  async #processMiddlewareFile(absolutePath: string): Promise<void> {
    const middlewareExports = await dynamicImport(absolutePath)

    const middlewareConfig = middlewareExports.default
    if (!middlewareConfig) {
      log({
        activityId: this.#activityId,
        message: `No middleware configuration found in ${absolutePath}. Skipping middleware configuration.`,
      })
      return
    }

    const routes = middlewareConfig.routes as MiddlewaresConfig["routes"]
    if (!routes || !Array.isArray(routes)) {
      log({
        activityId: this.#activityId,
        message: `Invalid default export found in ${absolutePath}. Make sure to use "defineMiddlewares" function and export its output.`,
      })
      return
    }

    const result = routes.reduce<{
      bodyParserConfigRoutes: BodyParserConfigRoute[]
      middleware: ScannedMiddlewareDescriptor[]
    }>(
      (result, route) => {
        if (!route.matcher) {
          throw new Error(
            `Middleware is missing a \`matcher\` field. The 'matcher' field is required when applying middleware. ${JSON.stringify(
              route,
              null,
              2
            )}`
          )
        }

        const matcher = String(route.matcher)

        if ("bodyParser" in route && route.bodyParser !== undefined) {
          result.bodyParserConfigRoutes.push({
            matcher: matcher,
            method: route.method,
            config: route.bodyParser,
          })
        }

        if (route.middlewares) {
          route.middlewares.forEach((middleware) => {
            result.middleware.push({
              handler: middleware,
              matcher: matcher,
              method: route.method,
            })
          })
        }
        return result
      },
      {
        bodyParserConfigRoutes: [],
        middleware: [],
      }
    )

    this.#middleware = result.middleware
    this.#bodyParserConfigRoutes = result.bodyParserConfigRoutes
  }

  /**
   * Scans a given directory for the "middleware.ts" or "middleware.js" files and
   * imports them for reading the registered middleware and configuration for
   * existing routes/middleware.
   */
  async scanDir(sourceDir: string) {
    const fs = new FileSystem(sourceDir)
    if (await fs.exists(`${MIDDLEWARE_FILE_NAME}.ts`)) {
      await this.#processMiddlewareFile(
        join(sourceDir, `${MIDDLEWARE_FILE_NAME}.ts`)
      )
    } else if (await fs.exists(`${MIDDLEWARE_FILE_NAME}.js`)) {
      await this.#processMiddlewareFile(
        join(sourceDir, `${MIDDLEWARE_FILE_NAME}.ts`)
      )
    }
  }

  /**
   * Returns a collection of registered middleware
   */
  getMiddlewares() {
    return this.#middleware
  }

  /**
   * Returns routes that have bodyparser config on them
   */
  getBodyParserConfigRoutes() {
    return this.#bodyParserConfigRoutes
  }
}
