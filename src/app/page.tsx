"use client";

import { cn } from "$src/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Link } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { buttonVariants } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";

export default function HomePage() {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8",
          )}
        >
          Login
        </Link>
        <div className="container flex flex-col gap-20 px-4 py-8 md:px-24 md:py-16">
          <div className="flex flex-col gap-8">
            <h1 className="text-center text-5xl  font-extrabold tracking-tight text-white md:text-[5rem]">
              <span className="text-teal">Incident</span> Reporter
            </h1>
            <p className="text-center text-2xl font-semibold md:text-xl">
              Report <span className="text-coral">incidents</span> lightning
              fast!
            </p>
          </div>
          <div className="flex w-full flex-col gap-8">
            <span className="text-center text-xl font-semibold md:text-xl">
              {status === "authenticated" ? (
                <>
                  <span className="text-teal">Welcome back,</span>{" "}
                  {session?.user?.name}
                </>
              ) : (
                <>
                  <span className="text-teal">Welcome!</span> Please sign in to
                  continue.
                </>
              )}
            </span>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message-2">Your Incident</Label>
              <Textarea placeholder="Type your message here." id="message-2" />
              <p className="text-muted-foreground text-sm">
                Your report will be sent to the support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
