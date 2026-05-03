import { NextResponse, type NextRequest } from "next/server";

// Protects /admin/* with HTTP Basic Auth using ADMIN_PASSWORD env var.
// The browser shows a native auth prompt — no login form needed.
export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return new NextResponse("ADMIN_PASSWORD env var not set", { status: 500 });
  }

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6));
    const idx = decoded.indexOf(":");
    const provided = idx === -1 ? decoded : decoded.slice(idx + 1);
    if (provided === password) return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Pharmroo Admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
