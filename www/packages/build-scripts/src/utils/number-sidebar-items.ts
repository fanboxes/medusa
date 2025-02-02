import { InteractiveSidebarItem, SidebarItem, SidebarItemCategory } from "types"

export default function numberSidebarItems(
  sidebarItems: SidebarItem[],
  numbering = [1]
): SidebarItem[] {
  if (!numbering.length) {
    numbering.push(1)
  }
  const isTopItems = numbering.length === 1
  const numberedItems: SidebarItem[] = []
  let parentItem: InteractiveSidebarItem | undefined
  sidebarItems.forEach((item) => {
    if (item.type === "separator") {
      ;(parentItem?.children || numberedItems).push(item)
      return
    }

    // append current number to the item's title
    item.chapterTitle = `${numbering.join(".")}. ${
      item.chapterTitle?.trim() || item.title?.trim()
    }`
    item.title = item.title.trim()

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
              initialOpen: false,
            }
      )

      parentItem = numberedItems[
        numberedItems.length - 1
      ] as SidebarItemCategory
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
