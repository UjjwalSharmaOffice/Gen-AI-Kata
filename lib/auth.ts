import { NextRequest, NextResponse } from "next/server";

export type AuthRole = "employee" | "admin";

export type AuthSession = {
  username: string;
  displayName: string;
  role: AuthRole;
};

type AuthUser = AuthSession & {
  password: string;
};

export const AUTH_COOKIE_NAME = "office-auth";

export const SAMPLE_CREDENTIALS: AuthUser[] = [
  {
    username: "employee.demo",
    password: "Employee@123",
    displayName: "Employee Demo",
    role: "employee",
  },
  {
    username: "admin.demo",
    password: "Admin@123",
    displayName: "Admin Demo",
    role: "admin",
  },
];

function encodeSession(session: AuthSession): string {
  return encodeURIComponent(JSON.stringify(session));
}

function decodeSession(value: string): AuthSession | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<AuthSession>;

    if (
      typeof parsed.username !== "string" ||
      typeof parsed.displayName !== "string" ||
      (parsed.role !== "employee" && parsed.role !== "admin")
    ) {
      return null;
    }

    return {
      username: parsed.username,
      displayName: parsed.displayName,
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

export function getSampleCredentials() {
  return SAMPLE_CREDENTIALS.map(({ username, password, displayName, role }) => ({
    username,
    password,
    displayName,
    role,
  }));
}

export function validateCredentials(username: string, password: string): AuthSession | null {
  const user = SAMPLE_CREDENTIALS.find(
    (candidate) => candidate.username === username && candidate.password === password
  );

  if (!user) {
    return null;
  }

  return {
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };
}

export function setAuthCookie(response: NextResponse, session: AuthSession) {
  response.cookies.set(AUTH_COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}

export function getSessionFromRequest(request: NextRequest): AuthSession | null {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!cookie) {
    return null;
  }

  return decodeSession(cookie);
}

export function unauthorizedResponse(message = "Authentication required") {
  return NextResponse.json(
    { success: false, message, error: message },
    { status: 401 }
  );
}

export function forbiddenResponse(message = "You do not have access to this resource") {
  return NextResponse.json(
    { success: false, message, error: message },
    { status: 403 }
  );
}

export function requireAuth(request: NextRequest, allowedRoles?: AuthRole[]) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return { session: null, response: unauthorizedResponse() };
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return { session: null, response: forbiddenResponse() };
  }

  return { session, response: null };
}