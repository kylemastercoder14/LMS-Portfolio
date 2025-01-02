import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./column";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Courses = async () => {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between my-3">
        <Heading title="Courses Record" description="Manage your courses" />
        <Link href="/teacher/create">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Course
          </Button>
        </Link>
      </div>
      <DataTable searchKey="title" columns={columns} data={courses} />
    </div>
  );
};

export default Courses;
