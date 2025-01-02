"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import ConfirmModal from "@/components/modal/confirm-modal";
import { toast } from "sonner";
import {
  deleteChapter,
  publishChapter,
  unpublishChapter,
} from "@/app/actions/chapter";
import { useRouter } from "next/navigation";

const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const onDelete = async () => {
    setIsLoading(true);
    try {
      const res = await deleteChapter(courseId, chapterId);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = async () => {
    setIsLoading(true);
    try {
      if (isPublished) {
        const res = await unpublishChapter(courseId, chapterId);
        if (res.success) {
          toast.success(res.success);
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await publishChapter(courseId, chapterId);
        if (res.success) {
          toast.success(res.success);
        } else {
          toast.error(res.error);
        }
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={onSubmit} disabled={disabled || isLoading}>
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading} variant="destructive">
          <Trash className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
