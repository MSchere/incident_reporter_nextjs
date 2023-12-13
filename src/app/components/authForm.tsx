"use client";

import * as React from "react";

import { cn } from "$src/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function AuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, startTransition] = useTransition();
  const [email, setEmail] = React.useState<string>("");

  async function onSubmit(event: React.SyntheticEvent) {
    try {
      event.preventDefault();
      await signIn("email", { email });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "There was an error signing in.",
      });
      console.error(error);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={(event) => startTransition(() => onSubmit(event))}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
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
            disabled={isLoading || !email}
            className="bg-coral text-background hover:bg-coral w-28 font-bold hover:brightness-90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
