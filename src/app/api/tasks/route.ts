import { verifySession } from "@/lib/dal";
import { db } from "@/lib/db";
import { taskSchema } from "@/schemas";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.id;

    const body = await req.json();

    const parsed = taskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Error in data entry fields!",
        },
        { status: 400 },
      );
    }

    const { title, description, priority } = parsed.data;

    const maxOrder = await db.task.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const nextOrder = (maxOrder?.order ?? 0) + 1;


    await db.task.create({
      data: {
        title,
        description,
        priority,
        order: nextOrder,
        user: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(
      { message: "Create new task successfully!" },
      { status: 201 },
    );
  } catch (error) {
    console.log("[TASK_POST]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
