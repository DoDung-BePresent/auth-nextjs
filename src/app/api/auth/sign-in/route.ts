import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { createSession, createToken } from "@/lib/session";

import { signInSchema } from "@/schemas";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Error in data entry fields!" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 },
      );
    }

    // USE: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    const token = await createToken({ id: user.id, email: user.email });

    await createSession(token);

    return NextResponse.json(
      { message: "Login successfully!" },
      { status: 200 },
    );
  } catch (error: any) {
    console.log("[SIGN_IN_POST]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
