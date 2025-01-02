import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FormWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  backButtonLabel: string;
  backButtonHref: string;
  backDescription: string;
  disabled?: boolean;
}

const FormWrapper = ({
  children,
  title,
  description,
  backButtonLabel,
  backButtonHref = "#",
  backDescription,
  disabled,
}: FormWrapperProps) => {
  return (
    <Card>
      <CardContent className="grid min-h-[400px] p-0 md:grid-cols-2">
        <div className="flex w-[400px] flex-col space-y-4 p-6">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-tight text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="flex-1">{children}</div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <div className="">
            <Button disabled={disabled} variant="outline" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-muted-foreground">Login with Google</span>
            </Button>
          </div>
          <div className="text-center text-sm">
            {backDescription}{" "}
            <Link
              href={backButtonHref}
              className="underline underline-offset-4 hover:text-primary/60"
            >
              {backButtonLabel}
            </Link>
          </div>
        </div>
        <div className="relative hidden md:block">
          <Image
            fill
            alt="placeholder"
            className="absolute aspect-auto object-cover"
            src="/placeholder.svg"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FormWrapper;
