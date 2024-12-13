import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const config = {
  matcher: ["/colors/:path*", "/generators/:path*", "/contrast-checker/:path*"],
}

export const middleware = ({ headers }: NextRequest) => {
  const blockedUserAgents = process.env.BLOCKED_USER_AGENTS?.split(",") ?? []
  const blockedIpAddresses = process.env.BLOCKED_IP_ADDRESSES?.split(",") ?? []

  const userAgent = headers.get("user-agent")
  const xRealIp = headers.get("x-real-ip")
  const xForwardedFor = headers.get("x-forwarded-for")
  const ip = xRealIp ?? xForwardedFor?.split(",").at(0)

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
