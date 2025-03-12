import { Sidebar } from "types"

type Options = {
  items: Sidebar.RawSidebarItem[]
  type?: Sidebar.SidebarSortType
}

export const sortSidebarItems = ({
  items,
  type = "none",
}: Options): Sidebar.RawSidebarItem[] => {
  switch (type) {
    case "alphabetize":
      return alphabetizeSidebarItems(items)
    default:
      return items
  }
}

const alphabetizeSidebarItems = (
  items: Sidebar.RawSidebarItem[]
): Sidebar.RawSidebarItem[] => {
  const segments: Sidebar.RawSidebarItem[][] = []
  let currentSegment: Sidebar.RawSidebarItem[] = []

  items.forEach((item) => {
    if (item.type === "separator") {
      if (currentSegment.length > 0) {
        segments.push(currentSegment)
        currentSegment = []
      }
      segments.push([item])
    } else {
      currentSegment.push(item)
    }
  })

  if (currentSegment.length > 0) {
    segments.push(currentSegment)
  }

  return segments
    .map((segment) => {
      return segment[0].type === "separator"
        ? segment
        : (segment as Sidebar.InteractiveSidebarItem[]).sort((a, b) =>
            a.title.localeCompare(b.title)
          )
    })
    .flat()
}
