import type { OpenAPI } from "types"
import dynamic from "next/dynamic"
import type { MethodLabelProps } from "@/components/MethodLabel"
import { Sidebar } from "types"
import { getSectionId } from "docs-utils"

const MethodLabel = dynamic<MethodLabelProps>(
  async () => import("../components/MethodLabel")
) as React.FC<MethodLabelProps>

export default function getTagChildSidebarItems(
  paths: OpenAPI.PathsObject
): Sidebar.SidebarItem[] {
  const items: Sidebar.SidebarItem[] = []
  Object.entries(paths).forEach(([, operations]) => {
    Object.entries(operations).map(([method, operation]) => {
      const definedOperation = operation as OpenAPI.Operation
      const definedMethod = method as OpenAPI.OpenAPIV3.HttpMethods
      items.push({
        type: "link",
        path: getSectionId([
          ...(definedOperation.tags || []),
          definedOperation.operationId,
        ]),
        title:
          definedOperation["x-sidebar-summary"] ||
          definedOperation.summary ||
          definedOperation.operationId,
        additionalElms: (
          <MethodLabel method={definedMethod} className="h-fit" />
        ),
        loaded: true,
      })
    })
  })

  return items
}
