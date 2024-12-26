"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const createChapter = async (title: string, courseId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to create a chapter" };
  }

  if (!title) {
    return { error: "Title is required" };
  }

  try {
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return { error: "You are not the owner of this course" };
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title: title,
        courseId: courseId,
        position: newPosition,
      },
    });

    return { id: chapter.id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const reorderChapters = async (
  updateData: { chapterId: string; position: number }[], // Updated type
  courseId: string
) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "You must be logged in to reorder chapters" };
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return { error: "You are not the owner of this course" };
    }

    for (const item of updateData) {
      await db.chapter.update({
        where: {
          id: item.chapterId,
        },
        data: {
          position: item.position,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const updateChapterTitle = async (
  title: string,
  courseId: string,
  chapterId: string
) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to create a course" };
  }

  if (!courseId) {
    return { error: "Course ID is required" };
  }

  if (!chapterId) {
    return { error: "Chapter ID is required" };
  }

  if (!title) {
    return { error: "Title is required" };
  }

  try {
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return { error: "You are not the owner of this course" };
    }

    const chapter = await db.chapter.update({
      data: {
        title: title,
      },
      where: { id: chapterId, courseId: courseId },
    });

    return { id: chapter.id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const createChapterDescription = async (
  description: string,
  courseId: string,
  chapterId: string
) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to create a course" };
  }

  if (!courseId) {
    return { error: "Course ID is required" };
  }

  if (!chapterId) {
    return { error: "Chapter ID is required" };
  }

  if (!description) {
    return { error: "Description is required" };
  }

  try {
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return { error: "You are not the owner of this course" };
    }

    const chapter = await db.chapter.update({
      data: {
        description: description,
      },
      where: { id: chapterId, courseId: courseId },
    });

    return { id: chapter.id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const createChapterAccess = async (
  isFree: boolean,
  courseId: string,
  chapterId: string
) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to create a course" };
  }

  if (!courseId) {
    return { error: "Course ID is required" };
  }

  if (!chapterId) {
    return { error: "Chapter ID is required" };
  }

  if (!isFree) {
    return { error: "Access is required" };
  }

  try {
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return { error: "You are not the owner of this course" };
    }

    const chapter = await db.chapter.update({
      data: {
        isFree: isFree,
      },
      where: { id: chapterId, courseId: courseId },
    });

    return { id: chapter.id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const createChapterVideo = async (
  videoUrl: string,
  courseId: string,
  chapterId: string
) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to create a course" };
  }

  if (!courseId) {
    return { error: "Course ID is required" };
  }

  if (!chapterId) {
    return { error: "Chapter ID is required" };
  }

  if (!videoUrl) {
    return { error: "Video is required" };
  }

  try {
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return { error: "You are not the owner of this course" };
    }

    const chapter = await db.chapter.update({
      data: {
        videoUrl: videoUrl,
      },
      where: { id: chapterId, courseId: courseId },
    });

    return { id: chapter.id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};
