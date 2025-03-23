import { readFileSync } from "fs"

const REGEX = /export const metadata = {[\s\S]*title: `(?<title>.*)`/

export function findMetadataTitle(content: string): string | undefined {
  const headingMatch = REGEX.exec(content)

  return headingMatch?.groups?.title
}

export function findPageHeading(content: string): string | undefined {
  const headingMatch = /# (?<title>.*)/.exec(content)

  return headingMatch?.groups?.title
}

export function findAllPageHeadings({
  content,
  level = 1,
}: {
  content: string
  level?: number
}): string[] {
  const regex = new RegExp(
    `^${"#".repeat(level)}(?!#) (?<title>.*?)(?:\n|$)`,
    "gm"
  )
  const matches = [...content.matchAll(regex)]
  return matches.map((match) => match.groups?.title).filter(Boolean) as string[]
}

export function findPageTitle(filePath: string): string | undefined {
  const content = readFileSync(filePath, "utf-8")

  return findMetadataTitle(content) || findPageHeading(content)
}
