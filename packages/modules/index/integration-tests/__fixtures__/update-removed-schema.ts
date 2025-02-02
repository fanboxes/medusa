export const updateRemovedSchema = `
  type Product @Listeners(values: ["product.created", "product.updated", "product.deleted"]) {
    id: String
    title: String
    handle: String
    variants: [ProductVariant]
  }
  
  type ProductVariant @Listeners(values: ["variant.created", "variant.updated", "variant.deleted"]) {
    id: String
    product_id: String
    sku: String
    prices: [Price]
    description: String
  }
  
  type Price @Listeners(values: ["price.created", "price.updated", "price.deleted"]) {
    amount: Float
    currency_code: String
  }
`
