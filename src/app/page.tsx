"use client";

import { type Message } from "$src/lib/types";
import { Label } from "@radix-ui/react-label";
import { getCsrfToken, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { toast } from "./components/ui/use-toast";
import Loading from "./components/utils/Loading";

export default function HomePage() {
  const { data: session, status } = useSession({ required: true });
  const [response, setResponse] = useState("");

  useEffect(() => {
    const getFastApiResponse = async () => {
      const csrfToken = await getCsrfToken();

      if (!csrfToken) {
        throw new Error("No CSRF token");
      }

      const res = await fetch("fastapi/auth", {
        method: "GET",
        headers: {
          "X-XSRF-Token": csrfToken,
        },
      });
      const data = (await res.json()) as Message;
      setResponse(data.message);
    };
    getFastApiResponse().catch((err: unknown) => {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error fetching data from FastApi",
      });
    });
  }, []);

  onsubmit = async (e: Event) => {
    e.preventDefault();
    const csrfToken = await getCsrfToken();

    if (!csrfToken) {
      throw new Error("No CSRF token");
    }

    const res = await fetch("fastapi/incident", {
      method: "POST",
      headers: {
        "X-XSRF-Token": csrfToken,
      },
    });
    const data = (await res.json()) as Message;
    toast({
      title: data.message,
    });
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <Button
        variant="ghost"
        className="absolute right-0 top-0 rounded font-bold"
        onClick={() => signOut()}
      >
        Logout
      </Button>
      <div className="container flex flex-col items-center justify-center gap-20 px-4 py-8 md:px-24 md:py-16">
        <div className="flex flex-col gap-8 ">
          <h1 className="text-center text-5xl  font-extrabold tracking-tight text-white md:text-[5rem]">
            <span className="text-teal-400">Incident</span> Reporter
          </h1>
          <p className="text-center text-3xl font-semibold md:text-xl">
            Report incidents <span className="text-yellow-300">lightning</span>{" "}
            fast!
          </p>
        </div>
        <div className="flex w-[720px] max-w-full flex-col gap-8">
          <div className="flex justify-center text-center text-xl font-semibold md:text-xl">
            {status === "authenticated" ? (
              <span>{response ?? "No response from FastApi"}</span>
            ) : (
              <div className="h-6 w-[377px]">
                <Loading />
              </div>
            )}
          </div>
          <form className="flex w-full flex-col gap-4 ">
            <Label htmlFor="message-2">Your Incident</Label>
            <Textarea
              className="h-32"
              placeholder="Type your message here."
              id="message-2"
            />
            <p className="text-sm text-muted-foreground">
              Your report will be sent to the support team.
            </p>
            <Button type="submit" className="rounded">
              Submit incident
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
