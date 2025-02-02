import { logger } from "@medusajs/framework/logger"
import { Compiler } from "@medusajs/framework/build-tools"

export default async function build({
  directory,
  adminOnly,
}: {
  directory: string
  adminOnly: boolean
}) {
  logger.info("Starting build...")
  const compiler = new Compiler(directory, logger)

  const tsConfig = await compiler.loadTSConfigFile()
  if (!tsConfig) {
    logger.error("Unable to compile application")
    process.exit(1)
  }

  const promises: Promise<boolean>[] = []
  if (!adminOnly) {
    promises.push(compiler.buildAppBackend(tsConfig))
  }

  const bundler = await import("@medusajs/admin-bundler")
  promises.push(compiler.buildAppFrontend(adminOnly, tsConfig, bundler))
  const responses = await Promise.all(promises)

  if (responses.every((response) => response === true)) {
    process.exit(0)
  } else {
    process.exit(1)
  }
}
