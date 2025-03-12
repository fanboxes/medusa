import { outdent } from "outdent"
import { generateRoutes } from "../routes"
import { generateModule } from "../utils"

export async function generateVirtualRouteModule(
  sources: Set<string>,
  pluginMode = false
) {
  const routes = await generateRoutes(sources)

  const imports = [...routes.imports]

  const code = outdent`
    ${imports.join("\n")}

    ${
      pluginMode
        ? `const routeModule = { ${routes.code} }`
        : `export default { ${routes.code} }`
    }
  `

  return generateModule(code)
}
