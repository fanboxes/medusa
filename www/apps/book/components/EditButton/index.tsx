"use client"

import { EditButton as UiEditButton } from "docs-ui"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { generatedEditDates } from "../../generated/edit-dates.mjs"

const EditButton = () => {
  const pathname = usePathname()

  const editDate = useMemo(
    () =>
      (generatedEditDates as Record<string, string>)[
        `app${pathname.replace(/\/$/, "")}/page.mdx`
      ],
    [pathname]
  )

  return (
    <UiEditButton
      filePath={`/www/apps/book/app${pathname.replace(/\/$/, "")}/page.mdx`}
      editDate={editDate}
    />
  )
}

export default EditButton
