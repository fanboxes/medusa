import { MenuItem } from "./menu.js"

export type NavigationItemDropdown = {
  type: "dropdown"
  title: string
  children: (MenuItem & {
    useAsFallback?: boolean
  })[]
  project?: string
  link?: string
}

export type NavigationItemLink = {
  type: "link"
  link: string
  title: string
  project?: string
  useAsFallback?: boolean
}

export type NavigationItem = NavigationItemLink | NavigationItemDropdown
