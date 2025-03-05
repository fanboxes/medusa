import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  MiddlewareFunction,
  RouteHandler,
} from "../types"

export const wrapHandler = <T extends RouteHandler | MiddlewareFunction>(
  fn: T
) => {
  async function wrappedHandler(
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) {
    const req_ = req as MedusaRequest & { errors?: Error[] }
    if (req_?.errors?.length) {
      return res.status(400).json({
        errors: req_.errors,
        message:
          "Provided request body contains errors. Please check the data and retry the request",
      })
    }

    try {
      return await fn(req, res, next)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  if (fn.name) {
    Object.defineProperty(wrappedHandler, "name", { value: fn.name })
  }
  return wrappedHandler as T
}
