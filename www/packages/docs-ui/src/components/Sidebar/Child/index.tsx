"use client"

import React, { useMemo } from "react"
import clsx from "clsx"
import { ArrowUturnLeft } from "@medusajs/icons"
import { useSidebar } from "../../../providers"

export const SidebarChild = () => {
  const { goBack, shownSidebar } = useSidebar()

  const title = useMemo(() => {
    if (!shownSidebar) {
      return ""
    }

    return "childSidebarTitle" in shownSidebar
      ? shownSidebar.childSidebarTitle || shownSidebar.title
      : shownSidebar.title
  }, [shownSidebar])

  if (!shownSidebar) {
    return <></>
  }

  return (
    <div className="px-docs_0.75">
      <div
        onClick={goBack}
        className={clsx(
          "flex items-center justify-start my-docs_0.75 gap-[10px]",
          "border border-transparent cursor-pointer mx-docs_0.5",
          "!text-medusa-fg-base !text-compact-small-plus"
        )}
        tabIndex={-1}
      >
        <ArrowUturnLeft />
        <span className="truncate flex-1">{title}</span>
      </div>
    </div>
  )
}
