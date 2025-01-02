"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { CellAction } from "./cell-actions";
import { Badge } from "@/components/ui/badge";

export type CourseColumn = {
  id: string;
  title: string;
  price: number | null;
  isPublished: boolean;
  createdAt: Date;
};

export const columns: ColumnDef<CourseColumn>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.price !== null ? formatPrice(row.original.price) : "N/A",
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;
      return (
        <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => format(row.original.createdAt, "MMM dd, yyyy"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
