import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieName = "arch_admin_session";
const maxAgeSeconds = 60 * 60 * 8;

type SessionPayload = {
  email: string;
  exp: number;
};

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "arch-local-session-secret-change-before-production";
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function createSessionToken(email: string) {
  const payload: SessionPayload = {
    email,
    exp: Date.now() + maxAgeSeconds * 1000,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

function verifySessionToken(token: string): SessionPayload | null {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;

  if (payload.exp < Date.now()) {
    return null;
  }

  return payload;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function setAdminSession(email: string) {
  const cookieStore = await cookies();

  cookieStore.set(cookieName, createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.delete(cookieName);
}

export function validateAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return false;
  }

  return email.trim().toLowerCase() === adminEmail.toLowerCase() && password === adminPassword;
}
