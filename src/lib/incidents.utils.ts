import { getCsrfToken } from "next-auth/react";
import { type Incident, type IncidentStatus, type Message } from "./types";
import { IncidentArraySchema, MessageSchema } from "./zod.schemas";

export class IncidentUtils {

  static async getIncidents(): Promise<Incident[] | null> {
    try {
      const csrfToken = await getCsrfToken();

      if (!csrfToken) {
        throw new Error("No CSRF token");
      }

      const res = await fetch("fastapi/incidents", {
        method: "GET",
        headers: {
          "X-XSRF-Token": csrfToken,
        },
      });
      const incidents = IncidentArraySchema.parse(await res.json());
      return incidents;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async createIncident(
    title: string,
    description: string,
  ): Promise<Message | null> {
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
      return MessageSchema.parse(await res.json());
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async updateIncident(
    id: string,
    title: string,
    description: string,
    status: IncidentStatus,
  ): Promise<Message | null> {
    try {
      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        throw new Error("No CSRF token");
      }

      const body = JSON.stringify({
        title,
        description,
        status,
      });

      const res = await fetch(`fastapi/incident/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-Token": csrfToken,
        },
        body,
      });
      
      return MessageSchema.parse(await res.json());
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async deleteIncident(id: string): Promise<Message | null> {
    try {
      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        throw new Error("No CSRF token");
      }

      const res = await fetch(`fastapi/incident/${id}`, {
        method: "DELETE",
        headers: {
          "X-XSRF-Token": csrfToken,
        },
      });
      return MessageSchema.parse(await res.json());
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
