import React from "react"
import { Pagination } from "../Pagination"

export type FooterProps = {
  editComponent?: React.ReactNode
  showPagination?: boolean
  feedbackComponent?: React.ReactNode
  editDate?: string
}

export const Footer = ({
  editComponent,
  showPagination,
  feedbackComponent,
}: FooterProps) => {
  return (
    <>
      {feedbackComponent}
      {showPagination && <Pagination />}
      {editComponent}
    </>
  )
}
