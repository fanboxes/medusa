import { join } from "path"
import { WorkflowManager, WorkflowScheduler } from "@medusajs/orchestration"
import { MockSchedulerStorage } from "../__fixtures__/mock-scheduler-storage"
import { JobLoader } from "../job-loader"

describe("register jobs", () => {
  WorkflowScheduler.setStorage(new MockSchedulerStorage())

  afterEach(() => {
    WorkflowManager.unregisterAll()
  })

  it("should registers jobs from plugins", async () => {
    const jobLoader: JobLoader = new JobLoader(
      join(__dirname, "../__fixtures__/plugin/jobs")
    )
    await jobLoader.load()
    const workflow = WorkflowManager.getWorkflow("job-summarize-orders")
    expect(workflow).toBeDefined()
    expect(workflow?.options.schedule).toEqual({
      cron: "* * * * * *",
      numberOfExecutions: 2,
    })
  })

  it("should not load non js/ts files", async () => {
    const jobLoader: JobLoader = new JobLoader(
      join(__dirname, "../__fixtures__/plugin/jobs-with-other-files")
    )
    await jobLoader.load()
    const workflow = WorkflowManager.getWorkflow("job-summarize-orders")
    expect(workflow).toBeUndefined()
  })
})
