import { OpenAPI, Sidebar } from "types"
import { ItemsToAdd } from "../index.js"
import path from "path"
import { findAllPageHeadings, getSectionId } from "docs-utils"
import { readFile } from "fs/promises"
import { parse } from "@readme/openapi-parser"
import pkg from "pluralize"

const { singular } = pkg

export default async function getApiRefSidebarChildren(
  sidebar?: Sidebar.RawSidebar
): Promise<ItemsToAdd[]> {
  if (!sidebar) {
    return []
  }

  const projPath = path.resolve()
  const area = sidebar.sidebar_id
  const items: ItemsToAdd[] = [
    {
      type: "link",
      title: "Introduction",
      path: "introduction",
      loaded: true,
    },
  ]

  // get sidebar items from markdown files
  const markdownPath = path.join(projPath, "markdown", `${area}.mdx`)
  const headings = findAllPageHeadings({
    content: await readFile(markdownPath, "utf-8"),
    level: 2,
  })

  headings.forEach((heading) => {
    items.push({
      type: "link",
      title: heading,
      path: getSectionId([heading]),
      loaded: true,
    })
  })

  // read base specs
  const baseSpecs = (await parse(
    path.join(projPath, "specs", area, "openapi.yaml")
  )) as OpenAPI.ExpandedDocument

  if (baseSpecs.tags?.length) {
    items.push({
      type: "separator",
    })
  }

  // add tags to sidebar
  baseSpecs.tags?.forEach((tag: OpenAPI.TagObject) => {
    const item: ItemsToAdd = {
      type: "category",
      title: tag.name,
      children: [],
      loaded: false,
      showLoadingIfEmpty: true,
    }

    if (tag["x-associatedSchema"]) {
      const formattedName = singular(tag.name).replaceAll(" ", "")
      const schemaSlug = getSectionId([tag.name, formattedName, "schema"])
      item.children!.push({
        type: "link",
        path: schemaSlug,
        title: `${formattedName} Object`,
        loaded: true,
        badge: {
          variant: "neutral",
          text: "Schema",
        },
      })
    }

    items.push(item)
  })

  return items
}
