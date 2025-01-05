import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { decryptToken } from "@/lib/session";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("auth-session")?.value;

  if (cookie) {
    const session = await decryptToken(cookie);
    return session;
  }

  return null;
});
