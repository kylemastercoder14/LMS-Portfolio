"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { CourseColumn } from "./column";
import { useRouter } from "next/navigation";

interface CellActionProps {
  data: CourseColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const onCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success("Data copied to the clipboard");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="no-print" asChild>
          <Button variant="ghost" className="h-4 w-4 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/teacher/courses/${data.id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.title)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
