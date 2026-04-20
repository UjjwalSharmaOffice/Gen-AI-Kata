import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, AuthRole } from "@/lib/auth";

function readRoleFromCookie(request: NextRequest): AuthRole | null {
  const value = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as { role?: AuthRole };
    return parsed.role === "employee" || parsed.role === "admin" ? parsed.role : null;
  } catch {
    return null;
  }
}

function redirectToHome(request: NextRequest) {
  const url = new URL("/", request.url);
  url.searchParams.set("auth", "required");
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = readRoleFromCookie(request);

  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return redirectToHome(request);
    }
  }

  if (pathname.startsWith("/employee")) {
    if (role !== "employee") {
      return redirectToHome(request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*"],
};