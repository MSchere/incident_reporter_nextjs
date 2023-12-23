"use client";

import { IncidentUtils } from "$src/lib/incidents.utils";
import { refreshIncidents } from "$src/lib/signals";
import { IncidentStatus, type Incident } from "$src/lib/types";
import { DescriptionSchema, TitleSchema } from "$src/lib/zod.schemas";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "../hooks/use-toast";
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
import Spinner from "./utils/Spinner";

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
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(incidentToEdit?.title ?? "");
  const [description, setDescription] = useState(
    incidentToEdit?.description ?? "",
  );
  const [status, setStatus] = useState<IncidentStatus | string>(
    incidentToEdit?.status ?? IncidentStatus.OPEN,
  );
  async function onsubmit(e: FormEvent): Promise<void> {
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
    setLoading(true);
    const msg = !!incidentToEdit
      ? await IncidentUtils.updateIncident(
          incidentToEdit.id,
          title,
          description,
          status as IncidentStatus,
        )
      : await IncidentUtils.createIncident(title, description);
    if (!msg) {
      toast({
        variant: "destructive",
        title: `Something went when ${
          !!incidentToEdit ? "editing" : "submiting"
        } your incident report`,
      });
      setLoading(false);
      return;
    }
    await refreshIncidents();
    toast({
      variant: "creative",
      title: `Incident report ${
        !!incidentToEdit ? "edited" : "submitted"
      } successfully`,
    });
    setTitle("");
    setDescription("");
    setLoading(false);
    setOpen(false);
  }

  async function deleteIncident(): Promise<void> {
    console.log("deleteIncident", incidentToEdit);
    if (!incidentToEdit) {
      return;
    }
    setLoading(true);
    const res = await IncidentUtils.deleteIncident(incidentToEdit.id);
    if (!res) {
      toast({
        variant: "destructive",
        title: "Something went when deleting your incident report",
      });
      setLoading(false);
      return;
    }
    await refreshIncidents();
    toast({
      variant: "creative",
      title: "Incident report deleted successfully",
    });
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      { loading && <Spinner />}
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
                disabled={!admin || loading}
                className="disabled:opacity-100"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
              <Textarea
                disabled={!admin || loading}
                className="h-32 rounded disabled:opacity-100"
                placeholder="Type your message here."
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger disabled={!!!incidentToEdit || !admin || loading}>
                  <Button
                    className="w-full rounded"
                    disabled={!!!incidentToEdit || !admin || loading}
                    variant="secondary"
                  >
                    Status: {status.replace("_", " ")}
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
                  <Button type="submit" className="rounded" disabled={loading}>
                    {!!incidentToEdit ? "Update incident" : "Submit incident"}
                  </Button>
                  {!!incidentToEdit && (
                    <Button
                      type="button"
                      variant="destructive"
                      className="rounded"
                      disabled={loading}
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
