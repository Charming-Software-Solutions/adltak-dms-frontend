import { NextRequest, NextResponse } from "next/server";
import { UserRoleEnum } from "./enums";
import { getSession } from "./auth/session";

const protectedRoutes = [
  "/",
  "/distributions",
  "/products",
  "/tasks",
  "/assets",
  "/employee",
  "/classifications",
];
const publicRoutes = ["/login"];
const adminRoutes = ["/employees"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);

  const session = await getSession();
  const user = session?.user;

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isAdminRoute && user?.role !== UserRoleEnum.ADMIN) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
