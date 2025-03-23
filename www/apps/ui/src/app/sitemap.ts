import { retrieveMdxPages } from "build-scripts"
import type { MetadataRoute } from "next"
import path from "path"
import { siteConfig } from "../config/site"
import { basePathUrl } from "../lib/base-path-url"

export default function sitemap(): MetadataRoute.Sitemap {
  return retrieveMdxPages({
    basePath: path.resolve("src", "content", "docs"),
    testFileName: false,
  }).map((filePath) => ({
    url: `${siteConfig.baseUrl}${basePathUrl(filePath)}`,
  }))
}
