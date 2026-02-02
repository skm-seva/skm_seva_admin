import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("seva_admin_session")?.value;

  // 🔒 No session cookie → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Cookie exists → allow request
  // (JWT verification happens server-side)
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
