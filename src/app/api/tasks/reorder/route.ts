import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { tasks }: { tasks: number[] } = await req.json();

    console.log(tasks);

    for (let i = 0; i < tasks.length; i++) {
      await db.task.update({
        where: { id: tasks[i] },
        data: { order: i },
      });
    }

    return NextResponse.json(
      { message: "Task order updated!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[REORDER_TASKS]:", error);
    return NextResponse.json(
      { message: "Failed to update task order." },
      { status: 500 },
    );
  }
};
