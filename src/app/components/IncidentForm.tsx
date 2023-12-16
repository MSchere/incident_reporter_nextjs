import {
  DescriptionSchema,
  MessageSchema,
  TitleSchema,
} from "$src/lib/zod.schemas";
import { Label } from "@radix-ui/react-label";
import { getCsrfToken } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";

export default function IncidentForm() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function onsubmit(e: FormEvent) {
    try {
      e.preventDefault();
      const validatedTitle = TitleSchema.safeParse(title);
      console.log(title);
      if (!validatedTitle.success) {
        toast({
          variant: "destructive",
          title: "Title must be between 3 and 50 characters long",
        });
        return;
      }

      const validatedDescription = DescriptionSchema.safeParse(description);
      if (!validatedDescription.success) {
        toast({
          variant: "destructive",
          title: "Description must be between 3 and 500 characters long",
        });
        return;
      }

      const csrfToken = await getCsrfToken();

      if (!csrfToken) {
        throw new Error("No CSRF token");
      }

      const body = JSON.stringify({
        title,
        description,
      });

      const res = await fetch("fastapi/incident", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-Token": csrfToken,
        },
        body,
      });
      const data = MessageSchema.parse(await res.json());
      toast({
        variant: "creative",
        title: data.message,
      });
      setTitle("");
      setDescription("");
      location.reload();
    } catch (err: unknown) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error creating incident report",
      });
    }
  }

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={onsubmit}>
      <Label htmlFor="title">Your Incident</Label>
      <Input
        id="title"
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <Textarea
        className="h-32 rounded"
        placeholder="Type your message here."
        id="description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button type="submit" className="rounded">
        Submit incident
      </Button>
      <p className="text-sm text-muted-foreground">
        Your report will be sent to the support team.
      </p>
    </form>
  );
}
