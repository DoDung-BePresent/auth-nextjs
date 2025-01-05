"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { Task } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TaskItemProps {
  task: Task;
  index: number;
}

export const TaskItem = ({ task, index }: TaskItemProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(`/api/tasks/${task.id}`);
      router.refresh();
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const onChangeValue = async (value: string) => {
    try {
      setLoading(true);
      const res = await axios.patch(`/api/tasks/${task.id}`, {
        priority: value,
      });
      router.refresh();
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex items-center justify-between gap-2"
        >
          <div className="flex flex-1 items-start justify-between rounded-md border bg-card p-2 px-3 text-primary">
            <span>{task.title}</span>
            <div className="w-fit">
              <Select
                disabled={loading}
                defaultValue={task.priority}
                onValueChange={onChangeValue}
              >
                <SelectTrigger className="h-fit p-1 px-2">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            disabled={loading}
            onClick={onDelete}
            size="icon"
            variant="destructive"
          >
            <Trash />
          </Button>
        </div>
      )}
    </Draggable>
  );
};
