import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { decryptToken } from "@/lib/session";

const protectedRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const cookie = (await cookies()).get("auth-session")?.value;
  const session = await decryptToken(cookie);

  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  if (
    session?.id &&
    (req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
