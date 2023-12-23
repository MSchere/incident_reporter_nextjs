"use client";

import { signOut, useSession } from "next-auth/react";
import IncidentDialog from "./components/IncidentDialog";
import IncidentsTable from "./components/IncidentsTable";
import { Button } from "./components/ui/button";
import Loading from "./components/utils/Loading";

export default function HomePage() {
  const { status, data } = useSession({ required: true });

  return (
    <main className="container flex flex-col items-center justify-center gap-20 px-4 py-8 md:px-24 md:py-16 ">
      <div className="md:border-slate relative flex flex-col gap-16 rounded md:border-2 py-8 px-0 md:px-32">
        <div className="fixed md:absolute md:bg-transparent  right-0 top-0 flex w-full bg-background z-30 items-center justify-end gap-4 rounded font-bold p-2">
          {status === "authenticated" ? (
            <p className="text-base">
              Welcome back <span className="text-yellow-300">{data.user.name}</span>
            </p>
          ) : (
            <div className="h-6 w-[200px]">
              <Loading />
            </div>
          )}
          <Button
            variant="outline"
            className="rounded font-bold"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        </div>
        <div className="flex flex-col gap-8">
          <h1 className="text-center text-5xl  font-extrabold tracking-tight text-white md:text-[5rem]">
            <span className="text-red-500">Incident</span> Reporter
          </h1>
          <p className="text-center text-3xl font-semibold md:text-[2rem]">
            Report incidents <span className="text-yellow-300">lightning</span>{" "}
            fast!
          </p>
        </div>
        <div className="flex w-full flex-col gap-20 lg:w-[1080px]">
          <IncidentDialog admin={true}>
            <span className="text-bold border-2 border-destructive text-xl inline-flex w-[260px] items-center justify-center whitespace-nowrap rounded px-4 py-2 font-medium text-destructive-foreground ring-offset-background transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              Report a new incident
            </span>
          </IncidentDialog>
          <IncidentsTable />
        </div>
      </div>
    </main>
  );
}
