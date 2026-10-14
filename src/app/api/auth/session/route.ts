import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

type UserRole = "CUSTOMER" | "COURIER" | "ADMIN";

function getSecret(value: string | undefined) {
  return value ? new TextEncoder().encode(value) : null;
}

export async function POST(request: Request) {
  try {
    const { accessToken, refreshToken } = await request.json();

    if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
      return NextResponse.json(
        { message: "Authentication tokens are missing." },
        { status: 400 },
      );
    }

    const accessSecret = getSecret(ACCESS_SECRET);
    const refreshSecret = getSecret(REFRESH_SECRET);

    if (!accessSecret || !refreshSecret) {
      return NextResponse.json(
        { message: "Server authentication is not configured." },
        { status: 500 },
      );
    }

    const { payload: access } = await jwtVerify(accessToken, accessSecret);

    const { payload: refresh } = await jwtVerify(refreshToken, refreshSecret);

    const validRoles: UserRole[] = ["CUSTOMER", "COURIER", "ADMIN"];

    if (
      typeof access.userId !== "string" ||
      access.userId !== refresh.userId ||
      typeof access.role !== "string" ||
      !validRoles.includes(access.role as UserRole)
    ) {
      return NextResponse.json(
        { message: "Invalid authentication session." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });

    const secure = process.env.NODE_ENV === "production";

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: Math.max(
        0,
        Number(access.exp ?? 0) - Math.floor(Date.now() / 1000),
      ),
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: Math.max(
        0,
        Number(refresh.exp ?? 0) - Math.floor(Date.now() / 1000),
      ),
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Could not establish a valid session." },
      { status: 401 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json(
    { success: true, message: "Local session cleared." },
    { status: 200 },
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };

  response.cookies.set("accessToken", "", cookieOptions);
  response.cookies.set("refreshToken", "", cookieOptions);

  return response;
}
