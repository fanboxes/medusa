import { model } from "@medusajs/framework/utils"

const IndexData = model.define("IndexData", {
  id: model.text().primaryKey(),
  name: model.text().primaryKey(),
  data: model.json().default({}),
  staled_at: model.dateTime().nullable(),
})

export default IndexData
