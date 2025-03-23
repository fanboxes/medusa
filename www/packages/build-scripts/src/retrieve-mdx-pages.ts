import { readdirSync } from "fs"
import path from "path"
import { getFileSlugSync } from "docs-utils"

type Options = {
  basePath: string
  testFileName?: boolean
}

export function retrieveMdxPages({
  basePath,
  testFileName = true,
}: Options): string[] {
  function retrieveMdxFilesInPath(dir: string): string[] {
    const urls = []
    const files = readdirSync(dir, {
      withFileTypes: true,
    })

    for (const file of files) {
      const filePath = path.join(dir, file.name)
      if (file.isDirectory()) {
        if (!file.name.startsWith("_")) {
          urls.push(...retrieveMdxFilesInPath(filePath))
        }
        continue
      } else if (
        (testFileName && file.name !== "page.mdx") ||
        (!testFileName && !file.name.endsWith(".mdx"))
      ) {
        continue
      }

      const slug = getFileSlugSync(filePath)

      let url = slug || filePath.replace(basePath, "")

      if (testFileName || file.name === "index.mdx") {
        url = url.replace(file.name, "")
      } else {
        url = url.replace(".mdx", "")
      }

      url = url.replace(/\/$/, "")

      urls.push(url)
    }

    return urls
  }

  return retrieveMdxFilesInPath(basePath)
}
