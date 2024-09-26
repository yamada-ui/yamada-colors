import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const config = {
  matcher: ["/colors/:path*", "/generators/:path*", "/contrast-checker/:path*"],
}

export const middleware = ({ headers, ip }: NextRequest) => {
  const blockedUserAgents = process.env.BLOCKED_USER_AGENTS?.split(",") ?? []
  const blockedIpAddresses = process.env.BLOCKED_IP_ADDRESSES?.split(",") ?? []

  const userAgent = headers.get("user-agent")
  ip ??=
    headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",").at(0)

  if (userAgent) {
    const isBlockedUserAgent = (blockedUserAgent: string) =>
      userAgent
        .toLocaleUpperCase()
        .includes(blockedUserAgent.toLocaleUpperCase())

    if (blockedUserAgents.some(isBlockedUserAgent)) {
      return new NextResponse("Access Denied", { status: 403 })
    }
  }

  if (ip) {
    const isBlockedIpAddress = (blockedIpAddress: string) =>
      ip.includes(blockedIpAddress.toLocaleUpperCase())

    if (blockedIpAddresses.some(isBlockedIpAddress)) {
      return new NextResponse("Access Denied", { status: 403 })
    } else {
      console.log(ip)
    }
  }

  return NextResponse.next()
}
