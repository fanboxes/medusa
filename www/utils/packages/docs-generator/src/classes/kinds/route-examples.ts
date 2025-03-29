import ts from "typescript"
import { SyntaxKind } from "typescript"
import DefaultKindGenerator, { GetDocBlockOptions } from "./default.js"
import type { RouteExamples } from "types"
const EXAMPLE_CODEBLOCK_REGEX = /```(ts|typescript)\s*([.\s\S]*?)\s*```/

type RouteData = {
  route: string
  method: string
}

// eslint-disable-next-line max-len
class RouteExamplesKindGenerator extends DefaultKindGenerator<ts.MethodDeclaration> {
  public name = "route-examples"
  protected allowedKinds: SyntaxKind[] = [
    SyntaxKind.MethodDeclaration,
    SyntaxKind.ArrowFunction,
  ]

  /**
   * Gets the route examples from the specified node.
   *
   * @param node - The node to get the route examples from.
   * @param options - The options for the route examples.
   * @returns The route examples for the specified node.
   */
  async getDocBlock(
    node: ts.MethodDeclaration,
    options?: GetDocBlockOptions
  ): Promise<string> {
    if (!this.isAllowed(node)) {
      return await super.getDocBlock(node, options)
    }

    // extract the route path from the node
    const routeData = this.findRoute(node.body as ts.Node)

    if (!routeData.route) {
      return ""
    }
    if (!routeData.method) {
      routeData.method = "GET" // default method
    }

    // get examples from the comments
    const example = ts
      .getJSDocTags(node)
      .find((tag) => tag.tagName.escapedText === "example")

    if (!example || !example.comment) {
      return ""
    }

    const exampleText = this.getExampleText(
      typeof example.comment === "string"
        ? example.comment
        : example.comment[example.comment.length - 1].text
    )

    return JSON.stringify({
      [this.formatRouteData(routeData)]: {
        [this.getExampleType(node)]: exampleText,
      },
    } as RouteExamples)
  }

  getExampleText(comment: string): string {
    // try to match the example codeblock first
    const match = comment.match(EXAMPLE_CODEBLOCK_REGEX)
    if (match) {
      // return the last match
      return match[match.length - 1]
    }

    // consider the comment as the example text
    return comment
  }

  /**
   * Use this method later to support different example types.
   *
   * @param node - The node to get the example type for.
   * @returns The example type.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getExampleType(node: ts.MethodDeclaration): string {
    return "js-sdk"
  }

  /**
   * Finds the route data from the specified node.
   *
   * @param node - The node to find the route from.
   * @returns The route data.
   */
  findRoute(node: ts.Node): RouteData {
    const result = {
      route: "",
      method: "",
    }

    /**
     * Internal function to maybe set the route result for a string
     */
    const maybeSetRouteResult = (str: string) => {
      str = str.replace(/^["'`]|["'`]$/g, "")

      // check if any of the template variables are local variables
      const localVariables = this.getLocalVariables(node)
      const templateVariables = str.match(/{(.+?)}/g) || []
      for (const variable of templateVariables) {
        const variableName = variable.slice(1, -1)
        const localVariable = localVariables.get(variableName)
        if (localVariable && localVariable.valueDeclaration) {
          str = str.replace(
            `$${variable}`,
            this.getValueFromDeclaration(localVariable.valueDeclaration)
          )
        }
      }

      // replace the remaining template variables with correct OAS syntax
      str = str.toLowerCase().replace(/\$\{(.+?)\}/g, `{$1}`)

      // remove possible query params in string
      const queryIndex = str.indexOf("?")
      if (queryIndex > -1) {
        str = str.slice(0, queryIndex)
      }
      if (
        str.startsWith("/store") ||
        str.startsWith("/admin") ||
        str.startsWith("/auth")
      ) {
        result.route = str
      } else if (
        str === "get" ||
        str === "post" ||
        str === "put" ||
        str === "delete"
      ) {
        result.method = str.toUpperCase()
      }
    }

    if (
      node.kind === ts.SyntaxKind.StringLiteral ||
      node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
      node.kind === ts.SyntaxKind.TemplateExpression
    ) {
      maybeSetRouteResult(node.getText())
    } else if (
      ts.isIdentifier(node) &&
      ts.isCallExpression(node.parent) &&
      node.parent.expression.getText().endsWith(".fetch")
    ) {
      const localVariables = this.getLocalVariables(node)
      const variableSymbol = localVariables.get(node.getText())
      if (variableSymbol?.valueDeclaration) {
        maybeSetRouteResult(
          this.getValueFromDeclaration(variableSymbol.valueDeclaration)
        )
      }
    } else {
      node.forEachChild((child) => {
        if (result.route.length > 0 && result.method.length > 0) {
          return
        }

        const childResult = this.findRoute(child)
        if (result.route.length === 0) {
          result.route = childResult.route
        }
        if (result.method.length === 0) {
          result.method = childResult.method
        }
      })
    }

    return result
  }

  /**
   * Formats the route data as a string.
   *
   * @param routeData - The route data to format.
   * @returns The formatted route data as a string.
   */
  formatRouteData(routeData: RouteData): string {
    return `${routeData.method} ${routeData.route}`
  }

  /**
   * Checks whether a node can be documented.
   *
   * @param {ts.Node} node - The node to check for.
   * @returns {boolean} Whether the node can be documented.
   */
  canDocumentNode(node: ts.Node): boolean {
    // check if node has docblock
    return ts.getJSDocCommentsAndTags(node).length > 0 && !this.isPrivate(node)
  }

  /**
   * Checks whether a node is private.
   *
   * @param node - The node to check for.
   * @returns Whether the node is private.
   */
  isPrivate(node: ts.Node): boolean {
    // Check for explicit private keyword
    if (ts.canHaveModifiers(node)) {
      const modifiers = ts.getModifiers(node)
      if (modifiers) {
        return modifiers.some(
          (modifier) => modifier.kind === ts.SyntaxKind.PrivateKeyword
        )
      }
    }

    // Check for private class member
    return (node.flags & ts.ModifierFlags.Private) !== 0
  }

  getLocalVariables(node: ts.Node): Map<string, ts.Symbol> {
    const sourceFile = node.getSourceFile()
    return "locals" in sourceFile
      ? (sourceFile.locals as Map<string, ts.Symbol>)
      : new Map<string, ts.Symbol>()
  }

  getValueFromDeclaration(declaration: ts.Declaration) {
    if (!ts.isVariableDeclaration(declaration)) {
      return ""
    }

    const initializer = declaration.initializer
    if (!initializer || !ts.isStringLiteral(initializer)) {
      return ""
    }

    return initializer.getText().replace(/^["'`]|["'`]$/g, "")
  }
}

export default RouteExamplesKindGenerator
