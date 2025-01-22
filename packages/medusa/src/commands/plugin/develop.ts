import path from "path"
import { execFile } from "child_process"
import { logger } from "@medusajs/framework/logger"
import { Compiler } from "@medusajs/framework/build-tools"

export default async function developPlugin({
  directory,
}: {
  directory: string
}) {
  let isBusy = false
  const compiler = new Compiler(directory, logger)
  const yalcBin = path.join(path.dirname(require.resolve("yalc")), "yalc.js")

  await compiler.developPluginBackend(async () => {
    /**
     * Here we avoid multiple publish calls when the filesystem is
     * changed too quickly. This might result in stale content in
     * some edge cases. However, not preventing multiple publishes
     * at the same time will result in race conditions and the old
     * output might appear in the published package.
     */
    if (isBusy) {
      return
    }
    isBusy = true

    /**
     * Yalc is meant to be used a binary and not as a long-lived
     * module import. Therefore we will have to execute it like
     * a command to get desired outcome. Otherwise, yalc behaves
     * flaky.
     */
    execFile(
      yalcBin,
      ["publish", "--push", "--no-scripts"],
      {
        cwd: directory,
      },
      (error, stdout, stderr) => {
        isBusy = false
        if (error) {
          console.log(error)
        }
        console.log(stdout)
        console.error(stderr)
      }
    )
  })
}
