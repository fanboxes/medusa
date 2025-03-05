import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "../types"

export function applyParamsAsFilters(mappings: { [param: string]: string }) {
  return async function paramsAsFiltersMiddleware(
    req: MedusaRequest,
    _: MedusaResponse,
    next: MedusaNextFunction
  ) {
    for (const [param, paramValue] of Object.entries(req.params)) {
      if (mappings[param]) {
        req.filterableFields[mappings[param]] = paramValue
      }
    }

    return next()
  }
}
