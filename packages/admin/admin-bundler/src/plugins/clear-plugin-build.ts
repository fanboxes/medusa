import { rm } from "node:fs/promises"
import path from "node:path"
import type { Plugin } from "vite"

interface ClearPluginBuildOptions {
  outDir: string
}

export const clearPluginBuild = (options: ClearPluginBuildOptions): Plugin => ({
  name: "medusa:clear-plugin-build",
  buildStart: async () => {
    const adminDir = path.join(options.outDir, "admin")
    try {
      await rm(adminDir, { recursive: true, force: true })
    } catch (e) {
      // Directory might not exist, ignore
    }
  },
})
