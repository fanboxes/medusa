import type { OpenAPI, Sidebar } from "types"
import dynamic from "next/dynamic"
import type { MethodLabelProps } from "@/components/MethodLabel"
import { getSectionId } from "docs-utils"
import { SidebarItem } from "../types/global"
import { compareOperations } from "./sort-operations-utils"
const MethodLabel = dynamic<MethodLabelProps>(
  async () => import("../components/MethodLabel")
) as React.FC<MethodLabelProps>

export default function getTagChildSidebarItems(
  paths: OpenAPI.PathsObject
): Sidebar.SidebarItem[] {
  const items: SidebarItem[] = []
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
        http_method: definedMethod,
      })
    })
  })

  return items
    .sort((a, b) => {
      return compareOperations({
        httpMethodA: a.http_method || "",
        httpMethodB: b.http_method || "",
        summaryA: (a as Sidebar.SidebarItemLink).title,
        summaryB: (b as Sidebar.SidebarItemLink).title,
      })
    })
    .map(({ http_method, ...rest }) => rest)
}
