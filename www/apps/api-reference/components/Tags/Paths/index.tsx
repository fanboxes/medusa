"use client"

import type { Operation, PathsObject, TagObject } from "@/types/openapi"
import { findSidebarItem, useSidebar } from "docs-ui"
import { Fragment, Suspense, useEffect } from "react"
import dynamic from "next/dynamic"
import type { TagOperationProps } from "../Operation"
import clsx from "clsx"
import getTagChildSidebarItems from "@/utils/get-tag-child-sidebar-items"
import { useLoading } from "@/providers/loading"
import DividedLoading from "@/components/DividedLoading"
import { Sidebar } from "types"

const TagOperation = dynamic<TagOperationProps>(
  async () => import("../Operation")
) as React.FC<TagOperationProps>

export type TagPathsProps = {
  tag: TagObject
  paths: PathsObject
} & React.HTMLAttributes<HTMLDivElement>

const TagPaths = ({ tag, className, paths }: TagPathsProps) => {
  const { shownSidebar, addItems } = useSidebar()
  const { loading } = useLoading()

  useEffect(() => {
    if (!shownSidebar) {
      return
    }

    if (paths) {
      const parentItem = findSidebarItem({
        sidebarItems:
          "items" in shownSidebar
            ? shownSidebar.items
            : shownSidebar.children || [],
        item: { title: tag.name, type: "category" },
        checkChildren: false,
      }) as Sidebar.SidebarItemCategory
      const pathItems: Sidebar.SidebarItem[] = getTagChildSidebarItems(paths)
      const targetLength =
        pathItems.length + (tag["x-associatedSchema"] ? 1 : 0)
      if ((parentItem.children?.length || 0) < targetLength) {
        addItems(pathItems, {
          sidebar_id: shownSidebar.sidebar_id,
          parent: {
            type: "category",
            title: tag.name,
            path: "",
            changeLoaded: true,
          },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths, shownSidebar?.sidebar_id])

  return (
    <Suspense>
      <div className={clsx("relative", className)}>
        {loading && <DividedLoading className="mt-7" />}
        {Object.entries(paths).map(([endpointPath, operations], pathIndex) => (
          <Fragment key={pathIndex}>
            {Object.entries(operations).map(
              ([method, operation], operationIndex) => (
                <TagOperation
                  method={method}
                  operation={operation as Operation}
                  tag={tag}
                  key={`${pathIndex}-${operationIndex}`}
                  endpointPath={endpointPath}
                  className={clsx("pt-7")}
                />
              )
            )}
          </Fragment>
        ))}
      </div>
    </Suspense>
  )
}

export default TagPaths
