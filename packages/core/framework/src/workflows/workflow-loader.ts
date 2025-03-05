import { logger } from "../logger"
import { ResourceLoader } from "../utils/resource-loader"

export class WorkflowLoader extends ResourceLoader {
  protected resourceName = "workflow"

  constructor(sourceDir: string | string[]) {
    super(sourceDir)
  }

  protected async onFileLoaded(
    path: string,
    fileExports: Record<string, unknown>
  ) {
    logger.debug(`Registering workflows from ${path}.`)
  }

  /**
   * Load workflows from the source paths, workflows are registering themselves,
   * therefore we only need to import them
   */
  async load() {
    await super.discoverResources()

    logger.debug(`Workflows registered.`)
  }
}
