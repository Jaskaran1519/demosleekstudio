import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;
    const isManager = token?.role === "MANAGER";
    const isAdmin = token?.role === "ADMIN";
    const isAdminPanel = req.nextUrl.pathname.startsWith("/admin");
    const isAuthDebug = req.nextUrl.pathname.startsWith("/auth-debug");

    // Allow auth-debug regardless of auth status
    if (isAuthDebug) {
      return NextResponse.next();
    }

    // If navigating to admin panel
    if (isAdminPanel) {
      // If user is not an admin or a manager, redirect to home
      if (!isAdmin && !isManager) {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      // If user is a manager and trying to access a route other than /admin/orders or /admin
      if (
        isManager &&
        !req.nextUrl.pathname.startsWith("/admin/orders") &&
        req.nextUrl.pathname !== "/admin"
      ) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/orders";
        return NextResponse.redirect(url);
      }
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