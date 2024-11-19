import { UserLogin } from "@/types/user";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";

type SessionPayload = UserLogin & {
  expiresAt: Date;
};

const secret = new TextEncoder().encode(process.env.SECRET);

const REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

export async function createSession(userDataLogin: UserLogin) {
  const { access, refresh, user, employee } = userDataLogin;

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DURATION);

  const session = await encrypt({
    access,
    refresh,
    user,
    employee: employee
      ? {
          id: employee.id || "",
          name: employee.name || "",
          profile_image: employee.profile_image,
        }
      : undefined,
    expiresAt,
  });

  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookie = cookies().get("session")?.value;
  if (!cookie) {
    redirect("/login");
  }

  const payload = await decrypt(cookie);

  if (!payload) {
    redirect("/login");
  }

  return {
    access: payload.access,
    refresh: payload.refresh,
    user: payload.user,
    employee: payload.employee,
    expiresAt: new Date(payload.expiresAt),
  };
}

export async function deleteSession() {
  cookies().delete("session");
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Refresh token lifetime set to 7 days
    .sign(secret);
}

export async function decrypt(
  session: string | undefined = "",
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, secret, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}
