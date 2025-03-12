"use client"

import clsx from "clsx"
import Link from "next/link"
import React, { useMemo } from "react"
import { MenuItem, MenuItemLink, MenuItemSubMenu } from "types"
import { SelectedMenu } from ".."
import { TriangleRightMini } from "@medusajs/icons"

type MainNavMobileSubMenuProps = {
  menu: MenuItem[]
  title: string
  setSelectedMenus: React.Dispatch<React.SetStateAction<SelectedMenu>>
}

export const MainNavMobileSubMenu = ({
  menu,
  title,
  setSelectedMenus,
}: MainNavMobileSubMenuProps) => {
  const filteredItems: (MenuItemLink | MenuItemSubMenu)[] = useMemo(() => {
    return menu.filter(
      (item) => item.type === "link" || item.type === "sub-menu"
    ) as (MenuItemLink | MenuItemSubMenu)[]
  }, [menu])
  return (
    <div className="flex flex-col gap-[23px]">
      <span className="text-compact-small-plus text-medusa-fg-muted uppercase">
        {title}
      </span>
      <ul className="flex flex-col gap-[18px]">
        {filteredItems.map((item, index) => (
          <li
            key={index}
            className={clsx(
              "text-h1 text-medusa-fg-base cursor-pointer",
              "flex justify-between gap-docs_1"
            )}
          >
            {item.type === "link" && (
              <Link href={item.link} className="block w-full">
                {item.title}
              </Link>
            )}
            {item.type === "sub-menu" && (
              <div
                className="w-full flex justify-between gap-docs_1"
                onClick={() =>
                  setSelectedMenus((prev) => [
                    ...prev,
                    {
                      title: item.title,
                      menu: item.items,
                    },
                  ])
                }
              >
                <span>{item.title}</span>
                <TriangleRightMini />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
