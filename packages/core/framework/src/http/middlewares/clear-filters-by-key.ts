import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "../types"

export function clearFiltersByKey(keys: string[]) {
  return async function clearFiltersByKeyMiddleware(
    req: MedusaRequest,
    _: MedusaResponse,
    next: MedusaNextFunction
  ) {
    keys.forEach((key) => {
      delete req.filterableFields[key]
    })

    return next()
  }
}
