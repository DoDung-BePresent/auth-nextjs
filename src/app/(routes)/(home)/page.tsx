import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";

import { TaskForm } from "./components/task-form";
import { TaskList } from "./components/task-list";

const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    query: string;
  }>;
}) => {
  const session = await verifySession();

  if (!session) {
    redirect("/sign-in");
  }

  const query = (await searchParams).query;

  const tasks = await db.task.findMany({
    where: {
      userId: session.id,
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="grid grid-cols-2 gap-10">
      <TaskForm className="w-[400px]" />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default HomePage;
