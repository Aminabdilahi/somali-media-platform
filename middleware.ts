import { NextResponse, type NextRequest } from "next/server";

// Cheap gate: real authorization is enforced by the API on every request.
export function middleware(req: NextRequest) {
  if (!req.cookies.get("access_token")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!login|api|_next|favicon.ico).*)"] };
