"use client"

import {
  SidebarProvider as UiSidebarProvider,
  useScrollController,
} from "docs-ui"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Sidebar } from "types"
import { getSidebarForPath } from "../utils/get-sidebar-for-path"

type SidebarProviderProps = {
  children?: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { scrollableElement } = useScrollController()
  const [sidebar, setSidebar] = useState<Sidebar.Sidebar | undefined>()
  const pathname = usePathname()

  const loadSidebar = useCallback(
    async () => getSidebarForPath(pathname),
    [pathname]
  )

  useEffect(() => {
    loadSidebar()
      .then(setSidebar)
      .catch((error) => {
        console.error("Error loading sidebar:", error)
      })
  }, [loadSidebar])

  return (
    <UiSidebarProvider
      scrollableElement={scrollableElement}
      sidebars={
        sidebar
          ? [sidebar]
          : [
              {
                sidebar_id: "default",
                title: "Default",
                items: [],
              },
            ]
      }
    >
      {children}
    </UiSidebarProvider>
  )
}

export default SidebarProvider
