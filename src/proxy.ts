import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

type UserRole = "CUSTOMER" | "COURIER" | "ADMIN";

const DASHBOARDS: Record<UserRole, string> = {
  ADMIN: "/admin",
  COURIER: "/courier",
  CUSTOMER: "/dashboard",
};

const PROTECTED_ROUTES: {
  prefix: string;
  role: UserRole;
}[] = [
  { prefix: "/admin", role: "ADMIN" },
  { prefix: "/courier", role: "COURIER" },
  { prefix: "/dashboard", role: "CUSTOMER" },
];

function matchesRoute(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

async function getVerifiedRole(request: NextRequest): Promise<UserRole | null> {
  const token = request.cookies.get("accessToken")?.value;
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!token || !secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    if (
      payload.role === "ADMIN" ||
      payload.role === "COURIER" ||
      payload.role === "CUSTOMER"
    ) {
      return payload.role;
    }

    return null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const protectedRoute = PROTECTED_ROUTES.find(({ prefix }) =>
    matchesRoute(pathname, prefix),
  );

  // Leave public pages and API routes alone.
  if (!isAuthPage && !protectedRoute) {
    return NextResponse.next();
  }

  const role = await getVerifiedRole(request);

  // Authenticated users should not return to login/register.
  if (isAuthPage) {
    if (!role) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(DASHBOARDS[role], request.url));
  }

  // Protected routes require a valid access token.
  if (!role) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("redirectTo", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  // Users can only access their own role's dashboard.
  if (protectedRoute && role !== protectedRoute.role) {
    return NextResponse.rewrite(new URL("/_role-not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
