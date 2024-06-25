import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const middleware = ({ headers, ip }: NextRequest) => {
  const blockedUserAgents = process.env.BLOCKED_USER_AGENTS?.split(",") ?? []

  const userAgent = headers.get("user-agent")
  ip = headers.get("x-forwarded-for") || ip

  console.log("ip", ip)
  console.log("userAgent", userAgent)

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
