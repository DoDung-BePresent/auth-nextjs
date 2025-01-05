"use client";

import { useState } from "react";

import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { taskSchema } from "@/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface TaskFormProps {
  className?: string;
}

export const TaskForm = ({ className }: TaskFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
    },
  });

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/tasks", values);
      router.refresh();
      toast.success(res.data.message);
      form.reset();
    } catch (error: any) {
      console.log(error);
      if (error.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Create task</CardTitle>
        <CardDescription>Create detail task!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="grid grid-cols-6 items-end gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Task name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      rows={5}
                      className="resize-none"
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} className="mt-4 w-fit">
              {loading && <LoaderCircle className="animate-spin" />}
              Create
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
