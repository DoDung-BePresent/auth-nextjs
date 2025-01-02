import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export const createToken = async (payload: { id: number; email: string }) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(encodedKey);
};

export const decryptToken = async (session: string | undefined = "") => {
  try {
    const { payload } = await jwtVerify(session, encodedKey);
    return payload;
  } catch (error) {
    console.log("Failed to verify session!");
  }
};

export const createSession = async (token: string) => {
  const cookieStore = await cookies();

  cookieStore.set("auth-session", token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600,
  });
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth-session");
};
