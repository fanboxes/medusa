"use client"

import React from "react"
import { NavigationItemLink } from "types"
import { LinkButton } from "../../../.."
import clsx from "clsx"

type MainNavItemLinkProps = {
  item: NavigationItemLink
  isActive: boolean
  icon?: React.ReactNode
}

export const MainNavItemLink = ({
  item,
  isActive,
  icon,
}: MainNavItemLinkProps) => {
  return (
    <LinkButton
      href={item.link}
      className={clsx(
        isActive && "text-medusa-fg-base",
        !isActive && "text-medusa-fg-muted hover:text-medusa-fg-subtle"
      )}
    >
      {item.title}
      {icon}
    </LinkButton>
  )
}
