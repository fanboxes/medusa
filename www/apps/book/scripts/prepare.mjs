import { generateEditedDates } from "build-scripts"
import path from "path"
import { generateTags } from "tags"

async function main() {
  await generateEditedDates()
  await generateTags(path.resolve("..", "..", "packages", "tags"))
}

void main()
