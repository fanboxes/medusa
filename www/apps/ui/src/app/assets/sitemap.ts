import { MetadataRoute } from "next"

import { sidebars } from "@/config/sidebar"
import { absoluteUrl } from "@/lib/absolute-url"
import { Sidebar } from "types"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const items: Array<{
    url: string
    lastModified?: string | Date
  }> = []

  function pushItems(newItems: Sidebar.SidebarItem[]) {
    newItems.forEach((item) => {
      if (item.type !== "link") {
        return
      }

      items.push({
        url: absoluteUrl(item.path),
        lastModified: now,
      })

      if (item.children) {
        pushItems(item.children)
      }
    })
  }

  sidebars.forEach((sidebar) => pushItems(sidebar.items))

  return items
}
