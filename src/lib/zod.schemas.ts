import { z } from "zod";
import { IncidentStatus, type Incident, type Message } from "./types";

export const TitleSchema: z.ZodSchema<string> = z.string().min(3).max(50);

export const DescriptionSchema: z.ZodSchema<string> = z
  .string()
  .min(3)
  .max(500);

export const IncidentSchema: z.ZodSchema<Incident> = z.object({
  id: z.string(),
  title: TitleSchema,
  description: DescriptionSchema,
  status: z.enum([
    IncidentStatus.OPEN,
    IncidentStatus.IN_PROGRESS,
    IncidentStatus.RESOLVED,
    IncidentStatus.CLOSED,
  ]),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

export const IncidentArraySchema: z.ZodSchema<Incident[]> =
  z.array(IncidentSchema);


  export const MessageSchema: z.ZodSchema<Message> = z.object({
    message: z.string()
  });
