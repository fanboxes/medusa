import { buildEventNamesFromEntityName } from "../event-bus"
import { Modules } from "../modules-sdk"

const eventBaseNames: [
  "product",
  "productVariant",
  "productOption",
  "productOptionValue",
  "productType",
  "productTag",
  "productCategory",
  "productCollection"
] = [
  "product",
  "productVariant",
  "productOption",
  "productOptionValue",
  "productType",
  "productTag",
  "productCategory",
  "productCollection",
]

export const ProductEvents = buildEventNamesFromEntityName(
  eventBaseNames,
  Modules.PRODUCT
)
