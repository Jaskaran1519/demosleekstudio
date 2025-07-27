import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;
    const isAdmin = token?.role === "ADMIN";
    const isAdminPanel = req.nextUrl.pathname.startsWith("/admin");
    const isAuthDebug = req.nextUrl.pathname.startsWith("/auth-debug");

    // Allow auth-debug regardless of auth status
    if (isAuthDebug) {
      return NextResponse.next();
    }

    // If navigating to admin panel but not an admin
    if (isAdminPanel && !isAdmin) {
      // Redirect to home page if not an admin
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/auth-debug/:path*"],
}; 