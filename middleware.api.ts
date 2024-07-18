import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const middleware = ({ headers }: NextRequest) => {
  const blockedUserAgents = process.env.BLOCKED_USER_AGENTS?.split(",") ?? []

  const userAgent = headers.get("user-agent")

  if (
    userAgent &&
    blockedUserAgents.some((blockedUserAgent) =>
      userAgent
        .toLocaleUpperCase()
        .includes(blockedUserAgent.toLocaleUpperCase()),
    )
  ) {
    return new NextResponse("Access Denied", { status: 403 })
  }

  return NextResponse.next()
}
