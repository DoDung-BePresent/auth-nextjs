import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { signUpSchema } from "@/schemas";
import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Error in data entry field!" },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "This email has been registered!" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully!" },
      { status: 201 },
    );
  } catch (error: any) {
    console.log("[SIGN_UP_POST:]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
