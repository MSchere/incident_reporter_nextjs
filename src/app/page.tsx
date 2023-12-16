"use client";

import { signOut, useSession } from "next-auth/react";
import IncidentForm from "./components/IncidentForm";
import IncidentsTable from "./components/IncidentsTable";
import { Button } from "./components/ui/button";
import Loading from "./components/utils/Loading";

export default function HomePage() {
  const { status, data } = useSession({ required: true });

  return (
    <main className="flex flex-col items-center justify-center">
      <Button
        variant="ghost"
        className="absolute right-0 top-0 rounded font-bold"
        onClick={() => signOut()}
      >
        Logout
      </Button>
      <div className="container flex flex-col items-center justify-center gap-20 px-4 py-8 md:px-24 md:py-16 ">
        <div className="flex flex-col gap-8 ">
          <h1 className="text-center text-5xl  font-extrabold tracking-tight text-white md:text-[5rem]">
            <span className="text-red-500">Incident</span> Reporter
          </h1>
          <p className="text-center text-3xl font-semibold md:text-[2rem]">
            Report incidents <span className="text-yellow-300">lightning</span>{" "}
            fast!
          </p>
        </div>
        <div className="flex max-w-full flex-col gap-20 lg:w-[800px]">
          <div className="flex flex-col gap-8">
            <div className="flex justify-center text-center text-xl font-semibold">
              {status === "authenticated" ? (
                <span>
                  Welcome back {data.user.name}!
                </span>
              ) : (
                <div className="h-6 w-[377px]">
                  <Loading />
                </div>
              )}
            </div>
            <IncidentForm />
          </div>
          <IncidentsTable />
        </div>
      </div>
    </main>
  );
}
