import { OpenAPIV3 } from "openapi-types"
import { CodeSample } from "../../types/index.js"
import { getFakeStrValue } from "utils"
import { getRouteExamplesOutputBasePath } from "../../utils/get-output-base-paths.js"
import { RouteExamples } from "types"
import { readFileSync } from "fs"

type CodeSampleData = Omit<CodeSample, "source">

const JS_SDK_PREFIX = {
  store: `import Medusa from "@medusajs/js-sdk"

let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

`,
  admin: `import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

`,
}

/**
 * This class generates examples for OAS.
 */
class OasExamplesGenerator {
  static JSCLIENT_CODESAMPLE_DATA: CodeSampleData = {
    lang: "JavaScript",
    label: "JS SDK",
  }
  static CURL_CODESAMPLE_DATA: CodeSampleData = {
    lang: "Shell",
    label: "cURL",
  }

  private routeExamples: RouteExamples

  constructor() {
    // load route examples
    this.routeExamples = JSON.parse(
      readFileSync(getRouteExamplesOutputBasePath(), "utf8")
    )
  }

  generateJsSdkExanmple({
    method,
    path,
  }: {
    method: string
    path: string
  }): string {
    const normalizedMethod = method.toUpperCase()
    // Try to match route by normalizing path parameters
    // path parameters may have different names, so we normalize them
    // to a generic `{param}` placeholder
    const normalizedPath = path.replaceAll(/\{[^}]+\}/g, "{param}")
    const targetRouteKey = `${normalizedMethod} ${normalizedPath}`
    const matchingRouteKey = Object.keys(this.routeExamples).find((key) => {
      const normalizedKey = key.replaceAll(/\{[^}]+\}/g, "{param}")
      return normalizedKey === targetRouteKey
    })

    if (!matchingRouteKey || !this.routeExamples[matchingRouteKey]["js-sdk"]) {
      return ""
    }

    const area = path.startsWith("/store") ? "store" : "admin"
    return `${JS_SDK_PREFIX[area]}${this.routeExamples[matchingRouteKey]["js-sdk"]}`
  }

  /**
   * Generate cURL examples for an OAS operation.
   *
   * @param param0 - The operation's details.
   * @returns The cURL example.
   */
  generateCurlExample({
    method,
    path,
    isAdminAuthenticated,
    isStoreAuthenticated,
    requestSchema,
  }: {
    /**
     * The HTTP method.
     */
    method: string
    /**
     * The API Route's path.
     */
    path: string
    /**
     * Whether the route requires admin authentication.
     */
    isAdminAuthenticated?: boolean
    /**
     * Whether the route requires customer authentication.
     */
    isStoreAuthenticated?: boolean
    /**
     * The schema of the request body, if any.
     */
    requestSchema?: OpenAPIV3.SchemaObject
  }): string {
    const exampleArr = [
      `curl${
        method.toLowerCase() !== "get" ? ` -X ${method.toUpperCase()}` : ""
      } '{backend_url}${path}'`,
    ]

    if (isAdminAuthenticated) {
      exampleArr.push(`-H 'Authorization: Bearer {access_token}'`)
    } else if (isStoreAuthenticated) {
      exampleArr.push(`-H 'Authorization: Bearer {access_token}'`)
    }

    if (path.startsWith("/store")) {
      exampleArr.push(`-H 'x-publishable-api-key: {your_publishable_api_key}'`)
    }

    if (requestSchema) {
      const requestData = this.getSchemaRequiredData(requestSchema)

      if (Object.keys(requestData).length > 0) {
        exampleArr.push(`-H 'Content-Type: application/json'`)
        exampleArr.push(
          `--data-raw '${JSON.stringify(requestData, undefined, 2)}'`
        )
      }
    }

    return exampleArr.join(` \\\n`)
  }

  /**
   * Retrieves data object from a schema object. Only retrieves the required fields.
   *
   * @param schema - The schema to retrieve its required data object.
   * @returns An object of required data and their fake values.
   */
  getSchemaRequiredData(
    schema: OpenAPIV3.SchemaObject
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {}

    if (schema.required?.length && schema.properties) {
      schema.required.forEach((propertyName) => {
        // extract property and its type
        const property = schema.properties![
          propertyName
        ] as OpenAPIV3.SchemaObject
        let value: unknown
        if (property.type === "object") {
          const typedValue: Record<string, unknown> = {}
          // get the fake value of every property in the object
          if (property.properties) {
            Object.entries(property.properties).forEach(
              ([childName, childProp]) => {
                const typedChildProp = childProp as OpenAPIV3.SchemaObject
                if (!typedChildProp.type) {
                  return
                }
                // if the property is an object, get its data object
                // otherwise, get its fake value
                typedValue[childName] =
                  typedChildProp.type === "object"
                    ? this.getSchemaRequiredData(
                        typedChildProp as OpenAPIV3.SchemaObject
                      )
                    : getFakeStrValue({
                        name: childName,
                        type: typedChildProp.type,
                        format: typedChildProp.format,
                      })
              }
            )
          }

          value = typedValue
        } else if (property.type === "array") {
          // if the type of the array's items is an object, retrieve
          // its data object. Otherwise, retrieve its fake value.
          const propertyItems = property.items as OpenAPIV3.SchemaObject
          if (!propertyItems.type) {
            value = []
          } else {
            value = [
              propertyItems.type === "object"
                ? this.getSchemaRequiredData(
                    property.items as OpenAPIV3.SchemaObject
                  )
                : getFakeStrValue({
                    name: propertyName,
                    type: propertyItems.type,
                    format: propertyItems.format,
                  }),
            ]
          }
        } else if (property.type) {
          // retrieve fake value for all other types
          value = getFakeStrValue({
            name: propertyName,
            type: property.type,
            format: property.format,
          })
        }

        if (value !== undefined) {
          data[propertyName] = value
        }
      })
    }

    return data
  }
}

export default OasExamplesGenerator
