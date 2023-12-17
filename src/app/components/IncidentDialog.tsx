"use client";

import { IncidentStatus, type Incident } from "$src/lib/types";
import {
  DescriptionSchema,
  MessageSchema,
  TitleSchema,
} from "$src/lib/zod.schemas";
import { getCsrfToken } from "next-auth/react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";

interface Props {
  admin?: boolean;
  incidentToEdit?: Incident;
  children: ReactNode;
}

export default function IncidentDialog({
  admin,
  incidentToEdit,
  children,
}: Props) {
  const [title, setTitle] = useState(incidentToEdit?.title ?? "");
  const [description, setDescription] = useState(
    incidentToEdit?.description ?? "",
  );
  const [status, setStatus] = useState<IncidentStatus | string>(
    incidentToEdit?.status ?? IncidentStatus.OPEN,
  );

  async function onsubmit(e: FormEvent) {
    e.preventDefault();
    const validatedTitle = TitleSchema.safeParse(title);
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
    const res = !!incidentToEdit
      ? await updateIncident()
      : await createIncident();
    if (!res) {
      return;
    }
    const data = MessageSchema.parse(await res.json());
    console.log(data);
    location.reload();
    // toast({
    //   variant: "creative",
    //   title: data.message,
    // });
  }

  async function createIncident(): Promise<Response | undefined> {
    try {
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
      return res;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Something went when creating your incident report",
      });
      return undefined;
    }
  }

  async function updateIncident(): Promise<Response | undefined> {
    try {
      if (!incidentToEdit) {
        return undefined;
      }

      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        throw new Error("No CSRF token");
      }

      const body = JSON.stringify({
        title,
        description,
        status,
      });

      const res = await fetch(`fastapi/incident/${incidentToEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-Token": csrfToken,
        },
        body,
      });
      return res;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Something went when updating your incident report",
      });
      return undefined;
    }
  }

  async function deleteIncident(): Promise<Response | undefined> {
    try {
      if (!incidentToEdit) {
        return undefined;
      }

      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        throw new Error("No CSRF token");
      }

      const res = await fetch(`fastapi/incident/${incidentToEdit.id}`, {
        method: "DELETE",
        headers: {
          "X-XSRF-Token": csrfToken,
        },
      });
      return res;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Something went when deleting your incident report",
      });
      return undefined;
    }
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">
            {!!incidentToEdit && admin
              ? "Edit report"
              : admin
                ? "Report a new incident"
                : "View report"}
          </DialogTitle>
          <DialogDescription>
            <form className="flex w-full flex-col gap-4" onSubmit={onsubmit}>
              <Input
                disabled={!admin}
                className="disabled:opacity-100"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
              <Textarea
                disabled={!admin}
                className="h-32 rounded disabled:opacity-100"
                placeholder="Type your message here."
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger disabled={!!!incidentToEdit || !admin}>
                  <Button
                    className="w-full rounded"
                    disabled={!!!incidentToEdit || !admin}
                    variant="secondary"
                  >
                    Status: {status}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuRadioGroup
                    value={status}
                    onValueChange={setStatus}
                  >
                    <DropdownMenuRadioItem value={IncidentStatus.OPEN}>
                      Open
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={IncidentStatus.IN_PROGRESS}>
                      In Progress
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={IncidentStatus.RESOLVED}>
                      Resolved
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={IncidentStatus.CLOSED}>
                      Closed
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {admin && (
                <>
                  <Button type="submit" className="rounded">
                    {!!incidentToEdit ? "Update incident" : "Submit incident"}
                  </Button>
                  {!!incidentToEdit && (
                    <Button
                      variant="destructive"
                      className="rounded"
                      onClick={deleteIncident}
                    >
                      Delete incident
                    </Button>
                  )}
                </>
              )}
              {!!incidentToEdit && (
                <span className="text-left text-sm text-muted-foreground">
                  {`Last updated on ${incidentToEdit.updatedAt.toLocaleString()} by ${
                    incidentToEdit.updatedBy
                  }`}
                </span>
              )}
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
