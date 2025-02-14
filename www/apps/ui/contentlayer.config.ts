import "dotenv/config"

import { defineDocumentType, makeSource } from "contentlayer/source-files"
import rehypeSlug from "rehype-slug"
import { uiRehypePlugin } from "../../packages/remark-rehype-plugins/src"
import { ExampleRegistry } from "./src/registries/example-registry"

export const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `docs/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    component: { type: "boolean", required: false, default: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => `/ui/${doc._raw.flattenedPath}`,
    },
    slugAsParams: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
    },
  },
}))

export default makeSource({
  contentDirPath: "./src/content",
  documentTypes: [Doc],
  mdx: {
    rehypePlugins: [
      [
        uiRehypePlugin,
        {
          exampleRegistry: ExampleRegistry,
        },
      ],
      [rehypeSlug],
    ],
    mdxOptions: (options) => {
      return {
        ...options,
        development: process.env.NODE_ENV === "development",
      }
    },
  },
})
