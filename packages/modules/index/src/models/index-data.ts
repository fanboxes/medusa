import { model } from "@medusajs/framework/utils"

const IndexData = model
  .define("IndexData", {
    id: model.text().primaryKey(),
    name: model.text().primaryKey(),
    data: model.json().default({}),
  })
  .indexes([
    {
      name: "IDX_index_data_gin",
      type: "GIN",
      on: ["data"],
    },
    {
      name: "IDX_index_data_id",
      on: ["id"],
    },
    {
      name: "IDX_index_data_name",
      on: ["name"],
    },
  ])

export default IndexData
