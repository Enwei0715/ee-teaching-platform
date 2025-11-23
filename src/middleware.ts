import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;

    // Public routes that don't require login
    const publicRoutes = [
      "/",
      "/auth/signin",
      "/auth/signup",
      "/courses/circuit-theory" // Only this course is free
    ];

    // Check if the path starts with any public route
    const isPublic = publicRoutes.some(route => path.startsWith(route));

    if (isPublic) {
      return NextResponse.next();
    }

    // If not public and not logged in, redirect to signin
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Admin routes protection
    if (path.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Allow if token exists OR if it's a public path (including sub-paths of circuit-theory)
        if (path.startsWith("/courses/circuit-theory") || path === "/" || path.startsWith("/auth")) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/courses/:path*", "/dashboard/:path*", "/admin/:path*", "/ai-tutor/:path*"],
};
