import { signal } from "@preact/signals-core";
import { IncidentUtils } from "./incidents.utils";
import { type Incident } from "./types";

export const incidentsSignal = signal<Incident[]>([]);

export const refreshIncidents = async () => {
  const incidents = await IncidentUtils.getIncidents();
  if (!incidents) {
    return;
  }
  incidentsSignal.value = incidents;
};
