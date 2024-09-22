import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const middleware = ({ headers }: NextRequest) => {
  const blockedUserAgents = process.env.BLOCKED_USER_AGENTS?.split(",") ?? []

  const userAgent = headers.get("user-agent")

  if (userAgent) {
    const isBlockedUserAgent = (blockedUserAgent: string) =>
      userAgent
        .toLocaleUpperCase()
        .includes(blockedUserAgent.toLocaleUpperCase())

    if (blockedUserAgents.some(isBlockedUserAgent)) {
      return new NextResponse("Access Denied", { status: 403 })
    }
  }

  return NextResponse.next()
}
