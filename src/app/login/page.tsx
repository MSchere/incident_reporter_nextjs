"use client";

import * as React from "react";

import { env } from "$src/env";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { getCsrfToken, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { toast } from "../components/ui/use-toast";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const [email, setEmail] = React.useState<string>("");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  async function onSubmit(event: React.SyntheticEvent) {
    try {
      event.preventDefault();
      const csrfToken = await getCsrfToken();

      if (!csrfToken) {
        throw new Error("No csrf token");
      }
      console.log(csrfToken);

      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth`, {
        method: "POST",
        headers: {
          "X-XSRF-Token": csrfToken,
        },
      });

      const data = await res.json() as string;
      toast({
        title: "Sign in successful",
      });
      console.log(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "There was an error signing in",
      });
      console.error(error);
    }
  }

  return (
    <main className="container flex h-full w-full flex-col items-center justify-center gap-20 px-4 py-8 md:px-24 md:py-16">
      <Card className="mx-auto flex w-full flex-col justify-center space-y-6 px-8 py-16 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your email below to create your account
          </p>
        </div>
        <form onSubmit={(event) => startTransition(() => onSubmit(event))}>
          <div className="flex flex-col gap-4">
            <div className="grid">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                className="w-full rounded"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="rounded"
              disabled={isLoading || !email}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </div>
        </form>
        <p className="text-muted-foreground px-8 text-center text-sm">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-primary underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </Card>
    </main>
  );
}
