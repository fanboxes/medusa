import { OptionType } from "@/hooks"
import { NavigationItem } from "types"

export const GITHUB_ISSUES_LINK =
  "https://github.com/medusajs/medusa/issues/new/choose"

export const navDropdownItems: NavigationItem[] = [
  {
    type: "link",
    link: `/learn`,
    title: "Get Started",
    project: "book",
  },
  {
    type: "dropdown",
    title: "Product",
    children: [
      {
        type: "link",
        title: "Commerce Modules",
        link: "/resources/commerce-modules",
      },
      {
        type: "link",
        title: "Architectural Modules",
        link: "/resources/architectural-modules",
      },
    ],
  },
  {
    type: "dropdown",
    title: "Build",
    project: "resources",
    children: [
      {
        type: "link",
        title: "Recipes",
        link: "/resources/recipes",
      },
      {
        type: "link",
        title: "How-to & Tutorials",
        link: "/resources/how-to-tutorials",
      },
      {
        type: "link",
        title: "Integrations",
        link: "/resources/integrations",
      },
      {
        type: "link",
        title: "Storefront",
        link: "/resources/storefront-development",
      },
    ],
  },
  {
    type: "dropdown",
    title: "Tools",
    link: "/resources/tools",
    project: "resources",
    children: [
      {
        type: "sub-menu",
        title: "CLI Tools",
        items: [
          {
            type: "link",
            title: "create-medusa-app",
            link: "/resources/create-medusa-app",
          },
          {
            type: "link",
            title: "Medusa CLI",
            link: "/resources/medusa-cli",
          },
        ],
      },
      {
        type: "link",
        title: "JS SDK",
        link: "/resources/js-sdk",
      },
      {
        type: "link",
        title: "Next.js Starter",
        link: "/resources/nextjs-starter",
      },
      {
        type: "link",
        title: "Medusa UI",
        link: "/ui",
      },
    ],
  },
  {
    type: "dropdown",
    title: "Reference",
    project: "resources",
    link: "/resources/references-overview",
    children: [
      {
        type: "link",
        title: "Admin API",
        link: "/api/admin",
      },
      {
        type: "link",
        title: "Store API",
        link: "/api/store",
      },
      {
        type: "divider",
      },
      {
        type: "link",
        title: "Admin Injection Zones",
        link: "/resources/admin-widget-injection-zones",
      },
      {
        type: "link",
        title: "Container Resources",
        link: "/resources/medusa-container-resources",
      },
      {
        type: "link",
        title: "Core Workflows",
        link: "/resources/medusa-workflows-reference",
      },
      {
        type: "link",
        title: "Data Model Language",
        link: "/resources/references/data-model",
      },
      {
        type: "link",
        title: "Events Reference",
        link: "/resources/events-reference",
      },
      {
        type: "link",
        title: "Helper Steps",
        link: "/resources/references/helper-steps",
      },
      {
        type: "link",
        title: "Service Factory",
        link: "/resources/service-factory-reference",
      },
      {
        type: "link",
        title: "Testing Framework",
        link: "/resources/test-tools-reference",
      },
      {
        type: "link",
        title: "Workflows SDK",
        link: "/resources/references/workflows",
      },
    ],
  },
  {
    type: "link",
    title: "User Guide",
    link: "/user-guide",
  },
]

export const searchFilters: OptionType[] = [
  {
    value: "guides",
    label: "Guides",
  },
  {
    value: "references-v2",
    label: "References",
  },
  {
    value: "admin-v2",
    label: "Admin API",
  },
  {
    value: "store-v2",
    label: "Store API",
  },
  {
    value: "ui",
    label: "Medusa UI",
  },
]
