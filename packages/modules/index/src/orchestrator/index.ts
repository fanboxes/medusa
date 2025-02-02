import { ILockingModule, IndexTypes, MedusaContainer } from "@medusajs/types"

export class Orchestrator {
  /**
   * Reference to the locking module
   */
  #lockingModule: ILockingModule

  /**
   * Owner id when acquiring locks
   */
  #lockingOwner = `index-sync-${process.pid}`

  /**
   * The current state of the orchestrator
   *
   * - In "idle" state, one can call the "run" method.
   * - In "processing" state, the orchestrator is looping over the entities
   *   and processing them.
   * - In "completed" state, the provided entities have been processed.
   * - The "error" state is set when the task runner throws an error.
   */
  #state: "idle" | "processing" | "completed" | "error" = "idle"

  /**
   * Options for the locking module and the task runner to execute the
   * task.
   *
   * - Lock duration is the maximum duration for which to hold the lock.
   *   After this the lock will be removed.
   *
   * - Task runner is the implementation function to execute a task.
   *   Orchestrator has no inbuilt execution logic and it relies on
   *   the task runner for the same.
   *
   *   The entity is provided to the taskRunner only when the orchestrator
   *   is able to acquire a lock.
   */
  #options: {
    lockDuration: number
    taskRunner: (
      entity: IndexTypes.SchemaObjectEntityRepresentation
    ) => Promise<void>
  }

  /**
   * Index of the entity that is currently getting processed.
   */
  #currentIndex: number = 0

  /**
   * Collection of entities to process in sequence. A lock is obtained
   * while an entity is getting synced to avoid multiple processes
   * from syncing the same entity
   */
  #entities: IndexTypes.SchemaObjectEntityRepresentation[] = []

  /**
   * The current state of the orchestrator
   */
  get state() {
    return this.#state
  }

  /**
   * Reference to the currently processed entity
   */
  get current() {
    return this.#entities[this.#currentIndex]
  }

  /**
   * Reference to the number of entities left for processing
   */
  get remainingCount() {
    return this.#entities.length - (this.#currentIndex + 1)
  }

  constructor(
    container: MedusaContainer,
    entities: IndexTypes.SchemaObjectEntityRepresentation[],
    options: {
      lockDuration: number
      taskRunner: (
        entity: IndexTypes.SchemaObjectEntityRepresentation
      ) => Promise<void>
    }
  ) {
    this.#lockingModule = container.resolve("locking")
    this.#entities = entities
    this.#options = options
  }

  /**
   * Acquires using the lock module.
   */
  async #acquireLock(forKey: string): Promise<boolean> {
    try {
      await this.#lockingModule.acquire(forKey, {
        expire: this.#options.lockDuration,
        ownerId: this.#lockingOwner,
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * Processes the entity at a given index. If there are no entities
   * left, the orchestrator state will be set to completed.
   */
  async #processAtIndex(index: number) {
    const entity = this.#entities[index]
    if (!entity) {
      this.#state = "completed"
      return
    }

    this.#currentIndex = index
    const lockAcquired = await this.#acquireLock(entity.entity)
    if (lockAcquired) {
      try {
        await this.#options.taskRunner(entity)
      } catch (error) {
        this.#state = "error"
        throw error
      } finally {
        await this.#lockingModule.release(entity.entity, {
          ownerId: this.#lockingOwner,
        })
      }
    }

    return this.#processAtIndex(index + 1)
  }

  /**
   * Run the orchestrator to process the entities one by one.
   */
  async process() {
    if (this.state !== "idle") {
      throw new Error("Cannot re-run an already running orchestrator instance")
    }

    this.#state = "processing"
    return this.#processAtIndex(0)
  }
}
