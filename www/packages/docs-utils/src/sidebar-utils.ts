import pkg from "slugify"
const { default: slugify } = pkg

export function getSectionId(path: string[]) {
  path = path.map((p) => slugify(p.trim().toLowerCase()))
  return path.join("_")
}
