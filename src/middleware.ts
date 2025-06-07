import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware();

// Match against the pages
export const config = { matcher: ['/((?!api/auth/callback|api/auth/signin|login|_next|favicon.ico|public|api/payments/callback).*)'] };

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Protect /admin and /api/admin/* routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const { user } = await getUser({ ensureSignedIn: true });
    // Use 'as any' to bypass type errors if needed (runtime fields exist)
    if (!user || (user as any).role !== "admin" || (user as any).deactivated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  // Protect /api/mcp for subscribers with credits
  if (pathname.startsWith("/api/mcp")) {
    const { user } = await getUser({ ensureSignedIn: true });
    if (!user || !(user as any).isSubscribed || (user as any).credits <= 0 || (user as any).deactivated) {
      return NextResponse.json({ error: "Access denied. Subscription and credits required." }, { status: 403 });
    }
  }
  return NextResponse.next();
}
