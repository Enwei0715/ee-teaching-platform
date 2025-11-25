import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;

    // Admin routes protection
    if (path.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // 1. Always allow homepage
        if (path === "/") return true;

        // 2. Define Public Paths (No Login Required)
        const publicPaths = [
          "/auth/signin",
          "/auth/signup",
          "/auth/error",
          "/courses/circuit-theory" // Free course
        ];

        // Check if path is public or a sub-path of a public route
        const isPublic = publicPaths.some(publicPath =>
          path === publicPath || path.startsWith(`${publicPath}/`)
        );

        if (isPublic) return true;

        // 3. Allow static assets and Next.js internals
        // (These are mostly handled by the matcher, but this is a safety net)
        if (
          path.startsWith("/_next") ||
          path.startsWith("/api/auth") ||
          path.includes(".") // Files like images, robots.txt, etc.
        ) {
          return true;
        }

        // 4. Require Token for Everything Else
        // This includes: /blog, /projects, /forum, /dashboard, /courses (except free one)
        return !!token;
      },
    },
  }
);

export const config = {
  // Match all request paths except for the ones starting with:
  // - api/auth (NextAuth API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - icon.png (favicon file)
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|icon.png|icon_without_text.png).*)"],
};
