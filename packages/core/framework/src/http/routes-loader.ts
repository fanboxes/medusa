import { join, parse, sep } from "path"
import { dynamicImport, readDirRecursive } from "@medusajs/utils"
import { logger } from "../logger"
import {
  type RouteVerb,
  HTTP_METHODS,
  type ScannedRouteDescriptor,
  type FileSystemRouteDescriptor,
} from "./types"

/**
 * File name that is used to indicate that the file is a route file
 */
const ROUTE_NAME = "route"

/**
 * Flag that developers can export from their route files to indicate
 * whether or not the routes from this file should be authenticated.
 */
const AUTHTHENTICATION_FLAG = "AUTHENTICATE"

/**
 * Flag that developers can export from their route files to indicate
 * whether or not the routes from this file should implement CORS
 * policy.
 */
const CORS_FLAG = "CORS"

/**
 * The matcher to use to convert the dynamic params from the filesystem
 * identifier to the express identifier.
 *
 * We capture all words under opening and closing brackets `[]` and mark
 * it as a param via `:`.
 */
const PARAM_SEGMENT_MATCHER = /\[(\w+)\]/

/**
 * Regexes to use to identify if a route is prefixed
 * with "/admin", "/store", or "/auth".
 */
const ADMIN_ROUTE_MATCH = /(\/admin$|\/admin\/)/
const STORE_ROUTE_MATCH = /(\/store$|\/store\/)/
const AUTH_ROUTE_MATCH = /(\/auth$|\/auth\/)/

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
 * Exposes to API to register routes manually or by scanning the filesystem from a
 * source directory.
 *
 * In case of duplicates routes, the route registered afterwards will override the
 * one registered first.
 */
export class RoutesLoader {
  /**
   * Routes collected manually or by scanning directories
   */
  #routes: Record<
    string,
    Record<string, ScannedRouteDescriptor | FileSystemRouteDescriptor>
  > = {}

  /**
   * An eventual activity id for information tracking
   */
  readonly #activityId?: string

  constructor({ activityId }: { activityId?: string }) {
    this.#activityId = activityId
  }

  /**
   * Creates the route path from its relative file path.
   */
  #createRoutePath(relativePath: string): string {
    const segments = relativePath.replace(/route(\.js|\.ts)$/, "").split(sep)
    const params: Record<string, boolean> = {}

    return `/${segments
      .filter((segment) => !!segment)
      .map((segment) => {
        if (segment.startsWith("[")) {
          segment = segment.replace(PARAM_SEGMENT_MATCHER, (_, group) => {
            if (params[group]) {
              log({
                activityId: this.#activityId,
                message: `Duplicate parameters found in route ${relativePath} (${group})`,
              })

              throw new Error(
                `Duplicate parameters found in route ${relativePath} (${group}). Make sure that all parameters are unique.`
              )
            }

            params[group] = true
            return `:${group}`
          })
        }
        return segment
      })
      .join("/")}`
  }

  /**
   * Returns the route config by exporting the route file and parsing
   * its exports
   */
  async #getRoutesForFile(
    routePath: string,
    absolutePath: string
  ): Promise<ScannedRouteDescriptor[]> {
    const routeExports = await dynamicImport(absolutePath)

    /**
     * Find the route type based upon its prefix.
     */
    const routeType = ADMIN_ROUTE_MATCH.test(routePath)
      ? "admin"
      : STORE_ROUTE_MATCH.test(routePath)
      ? "store"
      : AUTH_ROUTE_MATCH.test(routePath)
      ? "auth"
      : undefined

    /**
     * Check if the route file has decided to opt-out of authentication
     */
    const shouldAuthenticate =
      AUTHTHENTICATION_FLAG in routeExports
        ? !!routeExports[AUTHTHENTICATION_FLAG]
        : true

    /**
     * Check if the route file has decided to opt-out of CORS
     */
    const shouldApplyCors =
      CORS_FLAG in routeExports ? !!routeExports[CORS_FLAG] : true

    /**
     * Loop over all the exports and collect functions that are exported
     * with names after HTTP methods.
     */
    return Object.keys(routeExports)
      .filter((key) => {
        if (typeof routeExports[key] !== "function") {
          return false
        }

        if (!HTTP_METHODS.includes(key as RouteVerb)) {
          log({
            activityId: this.#activityId,
            message: `Skipping handler ${key} in ${absolutePath}. Invalid HTTP method: ${key}.`,
          })
          return false
        }

        return true
      })
      .map((key) => {
        return {
          route: routePath,
          method: key as RouteVerb,
          handler: routeExports[key],
          optedOutOfAuth: !shouldAuthenticate,
          shouldAppendAdminCors: shouldApplyCors && routeType === "admin",
          shouldAppendAuthCors: shouldApplyCors && routeType === "auth",
          shouldAppendStoreCors: shouldApplyCors && routeType === "store",
        } satisfies ScannedRouteDescriptor
      })
  }

  /**
   * Scans a given directory and loads all routes from it. You can access the loaded
   * routes via "getRoutes" method
   */
  async scanDir(sourceDir: string) {
    const entries = await readDirRecursive(sourceDir, {
      ignoreMissing: true,
    })

    await Promise.all(
      entries
        .filter((entry) => {
          if (entry.isDirectory()) {
            return false
          }

          const { name, ext } = parse(entry.name)
          if (name === ROUTE_NAME && [".js", ".ts"].includes(ext)) {
            const routeFilePathSegment = join(entry.path, entry.name)
              .replace(sourceDir, "")
              .split(sep)

            return !routeFilePathSegment.some((segment) =>
              segment.startsWith("_")
            )
          }

          return false
        })
        .map(async (entry) => {
          const absolutePath = join(entry.path, entry.name)
          const relativePath = absolutePath.replace(sourceDir, "")
          const route = this.#createRoutePath(relativePath)
          const routes = await this.#getRoutesForFile(route, absolutePath)

          routes.forEach((routeConfig) => {
            this.registerRoute({
              absolutePath,
              relativePath,
              ...routeConfig,
            })
          })
        })
    )
  }

  /**
   * Register a route
   */
  registerRoute(route: ScannedRouteDescriptor | FileSystemRouteDescriptor) {
    this.#routes[route.route] = this.#routes[route.route] ?? {}
    const trackedRoute = this.#routes[route.route]
    trackedRoute[route.method] = route
  }

  /**
   * Register one or more routes
   */
  registerRoutes(
    routes: (ScannedRouteDescriptor | FileSystemRouteDescriptor)[]
  ) {
    routes.forEach((route) => this.registerRoute(route))
  }

  /**
   * Returns an array of routes scanned by the routes loader or registered
   * manually.
   */
  getRoutes() {
    return Object.keys(this.#routes).reduce<
      (ScannedRouteDescriptor | FileSystemRouteDescriptor)[]
    >((result, routePattern) => {
      const methodsRoutes = this.#routes[routePattern]
      Object.keys(methodsRoutes).forEach((method) => {
        result.push(methodsRoutes[method])
      })
      return result
    }, [])
  }
}
