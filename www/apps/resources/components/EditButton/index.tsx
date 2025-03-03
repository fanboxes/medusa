"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { EditButton as UiEditButton } from "docs-ui"
import { filesMap } from "../../generated/files-map.mjs"
import { generatedEditDates } from "../../generated/edit-dates.mjs"

const EditButton = () => {
  const pathname = usePathname()
  const filePath = useMemo(
    () => filesMap.find((file) => file.pathname === pathname),
    [pathname]
  )

  const editDate = useMemo(
    () =>
      (generatedEditDates as Record<string, string>)[
        `app${pathname.replace(/\/$/, "")}/page.mdx`
      ],
    [pathname]
  )

  if (!filePath) {
    return <></>
  }

  return <UiEditButton filePath={filePath.filePath} editDate={editDate} />
}

export default EditButton
