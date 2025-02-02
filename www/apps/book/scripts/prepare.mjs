import { sidebar } from "../sidebar.mjs"
import { generateEditedDates, generateSidebar } from "build-scripts"

async function main() {
  await generateEditedDates()
  await generateSidebar(sidebar, {
    addNumbering: true,
  })
}

void main()
