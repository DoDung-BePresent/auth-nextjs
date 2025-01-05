import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/sign-in", "/sign-up"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get(
    process.env.SESSION_NAME as string,
  )?.value;

  if (
    !cookie &&
    (!req.nextUrl.pathname.startsWith("/sign-in") ||
      !req.nextUrl.pathname.startsWith("/sign-up")) &&
    !isPublicRoute
  ) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  } else if (
    cookie &&
    (req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
