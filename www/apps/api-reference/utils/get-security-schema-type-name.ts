import { OpenAPI } from "types"

export default function getSecuritySchemaTypeName(
  securitySchema: OpenAPI.OpenAPIV3.SecuritySchemeObject
) {
  switch (securitySchema.type) {
    case "apiKey":
      return "API Key"
    case "http":
      return "HTTP"
    case "oauth2":
      return "OAuth2"
    case "openIdConnect":
      return "OpenID Connect"
  }
}
