import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";

export const DELETE = async (
  _req: Request,
  {
    params,
  }: {
    params: Promise<{ taskId: string }>;
  },
) => {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;

    await db.task.delete({
      where: {
        id: Number.parseInt(taskId),
      },
    });

    return NextResponse.json(
      { message: "Delete task successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.log("[TASK_DELETE]:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) => {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;

    const { priority } = await req.json();

    await db.task.update({
      where: {
        id: Number.parseInt(taskId),
      },
      data: {
        priority,
      },
    });

    return NextResponse.json(
      {
        message: "Update priority successfully!",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("[PATCH_TASK]:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};
