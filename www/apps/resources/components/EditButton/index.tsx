"use client"

import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { EditButton as UiEditButton } from "docs-ui"

const EditButton = () => {
  const pathname = usePathname()
  const [editDate, setEditDate] = useState<string | undefined>()
  const [filePath, setFilePath] = useState<string | undefined>()

  const loadData = useCallback(async () => {
    const filesMap = await import("../../generated/files-map.mjs")
    const generatedEditDates = await import("../../generated/edit-dates.mjs")

    setFilePath(
      filesMap.filesMap.find((file) => file.pathname === pathname)?.filePath ||
        undefined
    )
    setEditDate(
      (generatedEditDates.generatedEditDates as Record<string, string>)[
        `app${pathname.replace(/\/$/, "")}/page.mdx`
      ]
    )
  }, [pathname])

  useEffect(() => {
    void loadData()
  }, [loadData])

  if (!editDate || !filePath) {
    return <></>
  }

  return <UiEditButton filePath={filePath} editDate={editDate} />
}

export default EditButton
