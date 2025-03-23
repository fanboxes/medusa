"use server"

import { OpenAPI } from "types"

const URL = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PATH}`

export async function getBaseSpecs(area: OpenAPI.Area) {
  try {
    const res = await fetch(`${URL}/base-specs?area=${area}`, {
      next: {
        revalidate: 3000,
        tags: [area],
      },
    }).then(async (res) => res.json())

    return res as OpenAPI.ExpandedDocument
  } catch (e) {
    console.error(e)
  }
}
