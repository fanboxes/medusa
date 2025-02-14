import { UnistNode, UnistTree } from "types"
import { Transformer } from "unified"

type Options = {
  url: string
}

export function addUrlToRelativeLink(options: Options): Transformer {
  return async (tree) => {
    const { visit } = await import("unist-util-visit")

    visit(tree as UnistTree, "link", (node: UnistNode) => {
      if (!node.url || !node.url.startsWith("/")) {
        return
      }

      node.url = `${options.url}${node.url}`
    })
  }
}
