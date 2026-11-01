import { NextRequest, NextResponse } from "next/server"

const privateRoutes = [
  "/create-event",
  "/manage-events",
  "/joined-events",
  "/profile",
]

export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies
    .getAll()
    .some((cookie) =>
      cookie.name === "better-auth.session_token" ||
      cookie.name === "__Secure-better-auth.session_token" ||
      cookie.name === "better-auth.session-token" ||
      cookie.name === "__Secure-better-auth.session-token"
    )

  if (!hasSessionCookie && privateRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/create-event/:path*",
    "/manage-events/:path*",
    "/joined-events/:path*",
    "/profile/:path*",
  ],
}
