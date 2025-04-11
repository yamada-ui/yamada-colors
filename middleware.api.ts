import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const config = {
  matcher: ["/colors/:path*", "/generators/:path*", "/contrast-checker/:path*"],
}

export const middleware = ({ headers }: NextRequest) => {
  const xRealIp = headers.get("x-real-ip")
  const xForwardedFor = headers.get("x-forwarded-for")
  const ip = xRealIp ?? xForwardedFor?.split(",").at(0)

  console.log(ip)

  return NextResponse.next()
}
