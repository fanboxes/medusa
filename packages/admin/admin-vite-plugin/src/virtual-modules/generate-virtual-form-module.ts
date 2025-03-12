import outdent from "outdent"
import { generateCustomFieldForms } from "../custom-fields"
import { generateModule } from "../utils"

export async function generateVirtualFormModule(
  sources: Set<string>,
  pluginMode = false
) {
  const customFields = await generateCustomFieldForms(sources)

  const imports = [...customFields.imports]

  const code = outdent`
          ${imports.join("\n")}

    ${
      pluginMode
        ? `const formModule = { ${customFields.code} }`
        : `export default { ${customFields.code} }`
    }
  `

  return generateModule(code)
}
