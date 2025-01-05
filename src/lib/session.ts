import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
const sessionName = process.env.SESSION_NAME as string;

export const createToken = async (payload: { id: number; email: string }) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(encodedKey);
};

export const decryptToken = async (session: string) => {
  const { payload } = await jwtVerify<{ id: number; email: string }>(
    session,
    encodedKey,
  );
  return payload;
};

export const createSession = async (token: string) => {
  const cookieStore = await cookies();

  cookieStore.set(sessionName, token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600,
  });
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(sessionName);
};
