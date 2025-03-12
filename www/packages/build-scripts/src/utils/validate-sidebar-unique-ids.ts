import { Sidebar } from "types"

export const validateSidebarUniqueIds = (
  sidebars: (Sidebar.RawSidebar | Sidebar.SidebarItemSidebar)[],
  sidebarIds = new Set<string>()
): void => {
  for (const sidebar of sidebars) {
    if (sidebarIds.has(sidebar.sidebar_id)) {
      throw new Error(`Duplicate sidebar item id found: ${sidebar.sidebar_id}`)
    }

    sidebarIds.add(sidebar.sidebar_id)

    const children = (
      "items" in sidebar ? sidebar.items : sidebar.children || []
    ).filter(
      (child) => child.type === "sidebar"
    ) as Sidebar.SidebarItemSidebar[]

    validateSidebarUniqueIds(children, sidebarIds)
  }
}
