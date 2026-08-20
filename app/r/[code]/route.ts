import { NextResponse } from "next/server";

const referralCookie = "arch_referral_code";

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const normalizedCode = decodeURIComponent(code || "").trim().toUpperCase();
  const destination = new URL("/apply", request.url);
  const response = NextResponse.redirect(destination);

  if (normalizedCode) {
    response.cookies.set(referralCookie, normalizedCode, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}
