import { minimatch } from "minimatch"
import AbstractGenerator from "./index.js"
import getBasePath from "../../utils/get-base-path.js"
import RouteExamplesKindGenerator from "../kinds/route-examples.js"
import ts from "typescript"
import type { RouteExamples } from "types"
import { getRouteExamplesOutputBasePath } from "../../utils/get-output-base-paths.js"
class RouteExamplesGenerator extends AbstractGenerator {
  protected routeExamplesKindGenerator?: RouteExamplesKindGenerator

  async run() {
    this.init()

    this.routeExamplesKindGenerator = new RouteExamplesKindGenerator({
      checker: this.checker!,
      generatorEventManager: this.generatorEventManager,
    })

    let routeExamples: RouteExamples = {}

    await Promise.all(
      this.program!.getSourceFiles().map(async (file) => {
        if (file.isDeclarationFile || !this.isFileIncluded(file.fileName)) {
          return
        }

        const fileNodes: ts.Node[] = [file]

        console.log(`[Route Examples] Generating for ${file.fileName}...`)

        // since typescript's compiler API doesn't support
        // async processes, we have to retrieve the nodes first then
        // traverse them separately.
        const pushNodesToArr = (node: ts.Node) => {
          fileNodes.push(node)

          ts.forEachChild(node, pushNodesToArr)
        }
        ts.forEachChild(file, pushNodesToArr)

        const documentChild = async (node: ts.Node) => {
          if (
            this.routeExamplesKindGenerator!.isAllowed(node) &&
            this.routeExamplesKindGenerator!.canDocumentNode(node)
          ) {
            const result =
              await this.routeExamplesKindGenerator!.getDocBlock(node)
            if (!result) {
              return
            }

            routeExamples = Object.assign(routeExamples, JSON.parse(result))
          }
        }

        await Promise.all(
          fileNodes.map(async (node) => await documentChild(node))
        )

        if (!this.options.dryRun) {
          this.writeJson(routeExamples)
        }
      })
    )
  }

  /**
   * Checks whether the specified file path is included in the program
   * and is an API file.
   *
   * @param fileName - The file path to check
   * @returns Whether the Route Examples generator can run on this file.
   */
  isFileIncluded(fileName: string): boolean {
    return (
      super.isFileIncluded(fileName) &&
      minimatch(
        getBasePath(fileName),
        "packages/core/**/js-sdk/src/@(store|admin|auth)/**",
        {
          matchBase: true,
        }
      )
    )
  }

  /**
   * Writes the route examples to a JSON file.
   *
   * @param routeExamples - The route examples to write.
   */
  writeJson(routeExamples: RouteExamples) {
    const filePath = getRouteExamplesOutputBasePath()

    const fileContent = JSON.stringify(routeExamples, null, 2)

    ts.sys.writeFile(filePath, fileContent)
  }
}

export default RouteExamplesGenerator
