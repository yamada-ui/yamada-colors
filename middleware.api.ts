import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const middleware = ({ headers, ip }: NextRequest) => {
  const blockedUserAgents = ["facebookexternalhit", "MJ12bot", "DataForSeoBot"]

  const userAgent = headers.get("user-agent")
  ip = headers.get("x-forwarded-for") || ip

  console.log("ip", ip)
  console.log("userAgent", userAgent)

  if (
    userAgent &&
    blockedUserAgents.some((blockedUserAgent) =>
      userAgent.includes(blockedUserAgent),
    )
  ) {
    return new NextResponse("Access Denied", { status: 403 })
  }

  return NextResponse.next()
}
