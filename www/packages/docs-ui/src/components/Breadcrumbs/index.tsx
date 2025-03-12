"use client"

import React, { useMemo } from "react"
import clsx from "clsx"
import Link from "next/link"
import { useSidebar, useSiteConfig } from "../../providers"
import { Button } from "../Button"
import { TriangleRightMini } from "@medusajs/icons"
import { Sidebar } from "types"

type BreadcrumbItems = {
  title: string
  link: string
}[]

export const Breadcrumbs = () => {
  const { sidebarHistory, getSidebarFirstLinkChild, getSidebar } = useSidebar()
  const {
    config: { breadcrumbOptions },
  } = useSiteConfig()

  const getLinkPath = (item: Sidebar.SidebarItemLink): string => {
    return item.isPathHref ? item.path : `#${item.path}`
  }

  const breadcrumbItems = useMemo(() => {
    const items: BreadcrumbItems = []
    if (breadcrumbOptions?.startItems) {
      items.push(...breadcrumbOptions.startItems)
    }

    sidebarHistory.forEach((sidebar_id) => {
      const sidebar = getSidebar(sidebar_id)

      if (!sidebar) {
        return
      }

      const sidebarFirstChild = getSidebarFirstLinkChild(sidebar)

      if (!sidebarFirstChild) {
        return
      }

      items.push({
        title: sidebar.title,
        link: getLinkPath(sidebarFirstChild),
      })
    })

    return items
  }, [sidebarHistory, breadcrumbOptions])

  return (
    <div
      className={clsx(
        "flex items-center gap-docs_0.25",
        "text-medusa-fg-muted text-compact-small",
        "mb-docs_1 flex-wrap"
      )}
    >
      {breadcrumbItems.map(({ title, link }, index) => (
        <React.Fragment key={link}>
          {index > 0 && <TriangleRightMini />}
          <Button
            variant="transparent-clear"
            className={clsx(
              "px-docs_0.5 py-docs_0.25",
              link === "#" && "hover:cursor-default",
              "!p-0 hover:!bg-transparent hover:!text-medusa-fg-subtle"
            )}
          >
            <Link
              href={link}
              className={clsx(link === "#" && "hover:cursor-default")}
            >
              {title}
            </Link>
          </Button>
        </React.Fragment>
      ))}
    </div>
  )
}
