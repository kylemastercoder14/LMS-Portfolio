/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ImageIcon, PencilIcon, PlusCircle } from "lucide-react";
import { addCourseImage, updateCourseTitle } from "@/app/actions/course";
import { toast } from "sonner";
import { Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

const ImageForm = ({
  initialData,
  courseId,
}: {
  initialData: Course;
  courseId: string;
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const toggleEdit = () => setIsEditing((prev) => !prev);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addCourseImage(values.imageUrl, courseId);
      toast.success("Course image added successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button onClick={toggleEdit} variant="outline">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData?.imageUrl && (
            <>
              <PlusCircle className="w-4 h-4" />
              Add image
            </>
          )}
          {!isEditing && initialData?.imageUrl && (
            <>
              <PencilIcon className="w-4 h-4" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData?.imageUrl ? (
          <div className="flex items-center justify-center h-60 mt-5 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="upload"
              fill
              className="object-cover rounded-md"
              src={initialData?.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio (recommended)
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
