/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ImageIcon, PencilIcon, PlusCircle, VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { Chapter, MuxData } from "@prisma/client";
import MuxPlayer from "@mux/mux-player-react";
import FileUpload from "@/components/file-upload";
import { createChapterVideo } from "@/app/actions/chapter";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  videoUrl: z.string().min(1, { message: "Image is required" }),
});

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const toggleEdit = () => setIsEditing((prev) => !prev);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await createChapterVideo(
        values.videoUrl,
        courseId,
        chapterId
      );
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button onClick={toggleEdit} variant="outline">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData?.videoUrl && (
            <>
              <PlusCircle className="w-4 h-4" />
              Add a video
            </>
          )}
          {!isEditing && initialData?.videoUrl && (
            <>
              <PencilIcon className="w-4 h-4" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData?.videoUrl ? (
          <div className="flex items-center justify-center h-60 mt-5 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Uplaod this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if the
          video does not appear.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
