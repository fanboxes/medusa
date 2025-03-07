import { InteractiveSidebarItem, RawSidebarItem, SidebarSortType } from "types"

type Options = {
  items: RawSidebarItem[]
  type?: SidebarSortType
}

export const sortSidebarItems = ({
  items,
  type = "none",
}: Options): RawSidebarItem[] => {
  switch (type) {
    case "alphabetize":
      return alphabetizeSidebarItems(items)
    default:
      return items
  }
}

const alphabetizeSidebarItems = (items: RawSidebarItem[]): RawSidebarItem[] => {
  const segments: RawSidebarItem[][] = []
  let currentSegment: RawSidebarItem[] = []

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
        : (segment as InteractiveSidebarItem[]).sort((a, b) =>
            a.title.localeCompare(b.title)
          )
    })
    .flat()
}
