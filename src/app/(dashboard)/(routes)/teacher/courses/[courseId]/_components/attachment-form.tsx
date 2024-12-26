/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { PlusCircle, File, Loader2, X } from "lucide-react";
import { addCourseAttachment, deleteCourseAttachment } from "@/app/actions/course";
import { toast } from "sonner";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";

const formSchema = z.object({
  url: z.string().min(1, { message: "Attachment is required" }),
});

const AttachmentForm = ({
  initialData,
  courseId,
}: {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const toggleEdit = () => setIsEditing((prev) => !prev);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addCourseAttachment(values.url, courseId);
      toast.success("Course attachment added successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteCourseAttachment(id, courseId);
      toast.success("Course attachment deleted successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center mb-3 justify-between">
        Course Attachment
        <Button onClick={toggleEdit} variant="outline">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="w-4 h-4" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="w-4 h-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button onClick={() => onDelete(attachment.id)} className="ml-auto hover:opacity-75 transition">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete this course.
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
