import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import * as QueryConfig from "./query-config"
import {
  AdminCreateDraftOrder,
  AdminGetDraftOrderParams,
  AdminGetDraftOrdersParams,
  AdminUpdateDraftOrder,
} from "./validators"

export const adminDraftOrderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/draft-orders",
    middlewares: [
      validateAndTransformQuery(
        AdminGetDraftOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/draft-orders/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders",
    middlewares: [
      validateAndTransformBody(AdminCreateDraftOrder),
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateDraftOrder),
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
