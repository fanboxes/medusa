import path from "path"
import coreConfig from "./modified.tailwind.config"

const root = path.join(require.resolve("docs-ui"), "../..")
const files = path.join(root, "**/*.{js,ts,jsx,tsx,mdx}")

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...coreConfig,
  content: [files],
}
