import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  return NextResponse.rewrite(
    new URL(
      `${request.nextUrl.basePath}/md-content${request.nextUrl.pathname.replace("/index.html.md", "")}`,
      request.url
    )
  )
}

export const config = {
  matcher: "/:path*/index.html.md",
}
