import { model } from "@medusajs/framework/utils"

const IndexRelation = model.define("IndexRelation", {
  id: model.autoincrement().primaryKey(),
  pivot: model.text(),
  parent_name: model.text(),
  parent_id: model.text().index("IDX_index_relation_parent_id"),
  child_name: model.text(),
  child_id: model.text().index("IDX_index_relation_child_id"),
})
export default IndexRelation
