import { globalConfig } from "docs-ui"
import { DocsConfig } from "types"
import { sidebars } from "./sidebar"

type SiteConfig = {
  name: string
  url: string
  description: string
} & DocsConfig

const baseUrl = process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:3000"

export const siteConfig: SiteConfig = {
  ...globalConfig,
  name: "Medusa UI",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  url: `${baseUrl}/${process.env.NEXT_PUBLIC_BASE_PATH}`,
  description: "Primitives for building Medusa applications.",
  sidebars,
  project: {
    title: "Medusa UI",
    key: "ui",
  },
  breadcrumbOptions: {
    startItems: [
      {
        title: "Documentation",
        link: baseUrl,
      },
    ],
  },
  logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/logo.png`,
  version: {
    ...globalConfig.version,
    hide: true,
  },
}
