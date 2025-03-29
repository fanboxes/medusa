import type { MetadataRoute } from "next"
import path from "path"
import getUrl from "../utils/get-url"
import { findAllPageHeadings, getSectionId } from "docs-utils"
import OpenAPIParser from "@readme/openapi-parser"
import { OpenAPI } from "types"
import { readFile } from "fs/promises"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items: MetadataRoute.Sitemap = []

  const markdownPath = path.join(process.cwd(), "markdown")

  for (const area of ["store", "admin"]) {
    // find and parse static headers from pages
    const markdownContent = await readFile(
      path.join(markdownPath, `${area}.mdx`),
      "utf-8"
    )

    const headings = findAllPageHeadings({ content: markdownContent, level: 2 })
    headings.forEach((heading) => {
      const objectID = getSectionId([heading])
      const url = getUrl(area, objectID)
      items.push({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
      })
    })

    // find and index tag and operations
    const baseSpecs = (await OpenAPIParser.parse(
      path.join(process.cwd(), `specs/${area}/openapi.full.yaml`)
    )) as OpenAPI.ExpandedDocument

    baseSpecs.tags?.map((tag) => {
      const tagName = getSectionId([tag.name])
      const url = getUrl(area, tagName)
      items.push({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
      })
    })

    const paths = baseSpecs.paths

    Object.values(paths).forEach((path) => {
      Object.values(path).forEach((op) => {
        const operation = op as OpenAPI.Operation
        const tag = operation.tags?.[0]
        const operationName = getSectionId([tag || "", operation.operationId])
        const url = getUrl(area, operationName)
        items.push({
          url,
          lastModified: new Date(),
          changeFrequency: "weekly",
        })
      })
    })
  }

  return items
}
