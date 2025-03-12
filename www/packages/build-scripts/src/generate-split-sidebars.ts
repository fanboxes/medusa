import { Sidebar } from "types"
import { generateSidebar, GenerateSidebarOptions } from "./index.js"
import path from "path"
import { existsSync, mkdirSync } from "fs"
import { writeFile } from "fs/promises"

function toCamelCase(str: string) {
  return str
    .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    .replace(/^./, (g) => g.toUpperCase())
}

export async function generateSplitSidebars({
  sidebars,
  options,
}: {
  sidebars: Sidebar.RawSidebar[]
  options?: GenerateSidebarOptions
}) {
  const generatedDirPath = path.resolve("generated")

  if (!existsSync(generatedDirPath)) {
    mkdirSync(generatedDirPath)
  }

  for (const sidebarItem of sidebars) {
    const generatedSidebar = (
      (await generateSidebar([sidebarItem], {
        ...options,
        writeToFile: false,
      })) as Sidebar.RawSidebar[]
    )[0]

    const varName = `generated${toCamelCase(sidebarItem.sidebar_id)}Sidebar`

    await writeFile(
      path.resolve(
        generatedDirPath,
        `generated-${sidebarItem.sidebar_id}-sidebar.mjs`
      ),
      `const generated${varName}Sidebar = ${JSON.stringify(
        generatedSidebar,
        null,
        2
      )}\n\nexport default generated${varName}Sidebar`,
      {
        flag: "w",
      }
    )
  }
}
