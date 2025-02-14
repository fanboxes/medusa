import { Transformer } from "unified"
import { ComponentLinkFixerOptions } from "types"
import { componentLinkFixer } from "./utils/component-link-fixer.js"

export function typeListLinkFixerPlugin(
  options?: ComponentLinkFixerOptions
): Transformer {
  return componentLinkFixer("TypeList", "types", options)
}
