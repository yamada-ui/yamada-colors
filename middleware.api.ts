import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const middleware = ({ headers, ip }: NextRequest) => {
  const blockedUserAgents = process.env.BLOCKED_USER_AGENTS?.split(",") ?? []

  const userAgent = headers.get("user-agent")
  ip ??=
    headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",").at(0)

  console.log("ip:", ip)
  console.log("x-real-ip:", headers.get("x-real-ip"))
  console.log(
    "x-forwarded-for:",
    headers.get("x-forwarded-for")?.split(",").at(0) ?? "Unknown",
  )

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
