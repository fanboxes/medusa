import type { OpenAPI } from "types"

export default function checkRequired(
  schema: OpenAPI.SchemaObject,
  property?: string
) {
  return property !== undefined && schema.required?.includes(property)
}
