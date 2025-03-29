import { retrieveMdxPages } from "build-scripts"
import type { MetadataRoute } from "next"
import path from "path"
import { config } from "../config"
import { basePathUrl } from "../utils/base-path-url"

export default function sitemap(): MetadataRoute.Sitemap {
  const items = retrieveMdxPages({
    basePath: path.resolve("app"),
  }).map((filePath) => ({
    url: `${config.baseUrl}${basePathUrl(filePath)}`,
  }))

  // add some references
  items.push(
    {
      url: `${config.baseUrl}${basePathUrl("/references/file-provider-module")}`,
    },
    {
      url: `${config.baseUrl}${basePathUrl("/references/file-service")}`,
    },
    {
      url: `${config.baseUrl}${basePathUrl("/references/locking-module-provider")}`,
    },
    {
      url: `${config.baseUrl}${basePathUrl("/references/locking-service")}`,
    },
    {
      url: `${config.baseUrl}${basePathUrl("/references/notification-provider-module")}`,
    },
    {
      url: `${config.baseUrl}${basePathUrl("/references/notification-service")}`,
    },
    {
      url: `${config.baseUrl}${basePathUrl("/references/event-service")}`,
    },
    {
      url: `${config.baseUrl}${basePathUrl("/references/cache-service")}`,
    },
    {
      url: `${config.baseUrl}${basePathUrl("/references/file-service")}`,
    },
    {
      url: `${config.baseUrl}${basePathUrl("/references/auth/provider")}`,
    },
    {
      url: `${config.baseUrl}${basePathUrl("/references/fulfillment/provider")}`,
    },
    {
      url: `${config.baseUrl}${basePathUrl("/references/tax/provider")}`,
    },
    {
      url: `${config.baseUrl}${basePathUrl("/references/payment/provider")}`,
    }
  )

  return items
}
