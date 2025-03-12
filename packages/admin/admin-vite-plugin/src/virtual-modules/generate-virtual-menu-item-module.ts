import outdent from "outdent"

import { generateMenuItems } from "../routes"
import { generateModule } from "../utils"

export async function generateVirtualMenuItemModule(
  sources: Set<string>,
  pluginMode = false
) {
  const menuItems = await generateMenuItems(sources)

  const code = outdent`
          ${menuItems.imports.join("\n")}

    ${
      pluginMode
        ? `const menuItemModule = { ${menuItems.code} }`
        : `export default { ${menuItems.code} }`
    }
  `

  return generateModule(code)
}
