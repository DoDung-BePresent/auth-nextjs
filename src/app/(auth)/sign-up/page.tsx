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

import { signUpSchema } from "@/schemas";

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/auth/sign-up`, values);
      toast.success(res.data.message);
      router.push("/sign-in");
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
    <FormWrapper
      disabled={loading}
      title="Create an account"
      description="Fill in the details below to create your account"
      backDescription="Already have an account?"
      backButtonLabel="Sign in"
      backButtonHref="/sign-in"
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="text"
                    placeholder="Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="mt-4 w-full" type="submit">
            {loading ? <LoaderCircle className="animate-spin" /> : ""}
            Create
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
};

export default SignUpPage;
