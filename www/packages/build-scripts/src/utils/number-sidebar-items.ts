import { Sidebar } from "types"

export default function numberSidebarItems(
  sidebarItems: Sidebar.SidebarItem[],
  numbering = [1]
): Sidebar.SidebarItem[] {
  if (!numbering.length) {
    numbering.push(1)
  }
  const isTopItems = numbering.length === 1
  const numberedItems: Sidebar.SidebarItem[] = []
  let parentItem: Sidebar.InteractiveSidebarItem | undefined
  sidebarItems.forEach((item) => {
    if (item.type === "separator") {
      ;(parentItem?.children || numberedItems).push(item)
      return
    }

    // append current number to the item's title
    const currentNumbering = `${numbering.join(".")}.`
    item.chapterTitle = `${currentNumbering} ${
      item.chapterTitle?.trim() || item.title?.trim()
    }`
    item.title = item.title.trim()
    item.number = currentNumbering

    if (isTopItems) {
      // Add chapter category
      numberedItems.push(
        item.type === "category"
          ? {
              ...item,
              title: item.chapterTitle,
            }
          : {
              type: "category",
              title: item.chapterTitle,
              children: [],
              loaded: true,
            }
      )

      parentItem = numberedItems[
        numberedItems.length - 1
      ] as Sidebar.SidebarItemCategory
    }

    if (item.children) {
      item.children = numberSidebarItems(item.children, [...numbering, 1])
    }

    if (item.type !== "category" || !isTopItems) {
      ;(parentItem?.children || numberedItems).push(item)
    }

    numbering[numbering.length - 1]++
  })

  return numberedItems
}
