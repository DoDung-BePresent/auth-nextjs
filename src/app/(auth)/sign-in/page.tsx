"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import FormWrapper from "../components/form-wrapper";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { signInSchema } from "@/schemas";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/sign-in", values);
      toast.success(res.data.message);
      router.push("/");
    } catch (error: any) {
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
    <FormWrapper
      disabled={loading}
      title="Welcome back"
      description="Login to your Acme Inc account"
      backDescription="Don't have an account?"
      backButtonLabel="Sign up"
      backButtonHref="/sign-up"
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="email"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="password"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="mt-4 w-full" type="submit">
            {loading ? <LoaderCircle className="animate-spin" /> : ""}
            Login
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
};

export default SignInPage;
