import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = req.nextauth?.token?.email;

    if (req.nextUrl.pathname.startsWith("/admin") && userEmail !== adminEmail) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/admin/:path*"] };
