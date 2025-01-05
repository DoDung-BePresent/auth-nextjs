"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Task } from "@prisma/client";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { TaskItem } from "./task-item";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface TaskListProps {
  tasks: Task[];
}

export const TaskList = ({ tasks: initialTasks }: TaskListProps) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tasks, setTasks] = useState(initialTasks);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    // If dropped outside a valid destination, do nothing
    if (!destination) return;

    // Reorder the tasks in the state
    const reorderedTasks = [...tasks];
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);

    setTasks(reorderedTasks);

    try {
      const res = await axios.post("/api/tasks/reorder", {
        tasks: reorderedTasks.map((t) => t.id),
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Fail when reorder!");
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>List task</CardTitle>
          <CardDescription>Manage your task</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="">
            <Label>Search</Label>
            <Input
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search tasks"
              className="mt-2"
              defaultValue={searchParams.get("query")?.toString()}
            />
          </div>
          <Separator className="my-4" />
          <Droppable droppableId="taskList">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="h-44 space-y-3 overflow-y-auto"
              >
                {tasks.map((task, index) => (
                  <TaskItem key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </CardContent>
      </Card>
    </DragDropContext>
  );
};
