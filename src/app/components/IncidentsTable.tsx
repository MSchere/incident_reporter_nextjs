"use client";

import { IncidentStatus, UserRole, type Incident } from "$src/lib/types";
import { IncidentArraySchema } from "$src/lib/zod.schemas";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, Search } from "lucide-react";
import { getCsrfToken, useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import IncidentDialog from "./IncidentDialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Loading from "./utils/Loading";

export default function IncidentsTable() {
  const { data } = useSession();
  const [loading, setLoading] = useState(true);
  const [transition, startTransition] = useTransition();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    setLoading(transition);
  }, [transition]);

  useEffect(() => {
    const getFastApiResponse = async () => {
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
      setIncidents(incidents);
    };
    startTransition(() => getFastApiResponse());
  }, []);

  const rankingColumns: ColumnDef<Incident>[] = [
    {
      accessorKey: "id",
      header: "Incident ID",
      cell: ({ row }) => {
        const incident = row.original;
        const id = incident.id;
        return (
          <IncidentDialog
            admin={
              data?.user.name?.toUpperCase() === UserRole.ADMIN ||
              data?.user.name === incident.createdBy
            }
            incidentToEdit={incident}
          >
            <span className="inline-flex w-[200px] items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded border border-input bg-background p-2 text-sm font-medium text-teal-400 ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              {id}
            </span>
          </IncidentDialog>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.original.title}</div>,
    },
    {
      accessorKey: "createdBy",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created By
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },      cell: ({ row }) => <div className="ml-4">{row.original.createdBy}</div>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="ml-4">{row.original.createdAt.toLocaleString()}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className="ml-4"
            style={
              status === IncidentStatus.OPEN
                ? { color: "#E12222" }
                : status === IncidentStatus.IN_PROGRESS
                  ? { color: "#FFC107" }
                  : status === IncidentStatus.CLOSED
                    ? { color: "#27951D" }
                    : { color: "#27951D" }
            }
          >
            {status}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data: incidents,
    columns: rankingColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="flex w-screen flex-col md:w-full">
      <div className="flex flex-col gap-0 sm:flex-row sm:gap-4">
        <div className="relative flex items-center pb-4">
          <Search className="absolute left-4" width={16} height={16} />
          <Input
            placeholder="search incident..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="w-[220px] rounded pl-12 text-primary"
          />
        </div>
      </div>
      <div className="border-t-2 lg:min-h-[770px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : loading ? (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              [...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell
                    colSpan={rankingColumns.length}
                    className="h-[71px]"
                  >
                    <Loading />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={rankingColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
