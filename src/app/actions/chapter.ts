"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

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

    if (videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await mux.video.assets.create({
        input: [{ url: videoUrl }],
        playback_policy: ["public"],
        video_quality: "basic",
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId: chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return { id: chapter.id, success: "Chapter updated successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const deleteChapter = async (courseId: string, chapterId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to delete a chapter" };
  }

  if (!courseId) {
    return { error: "Course ID is required" };
  }

  if (!chapterId) {
    return { error: "Chapter ID is required" };
  }

  try {
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter) {
      return { error: "Chapter not found" };
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return { success: "Chapter deleted successfully", data: deletedChapter };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const publishChapter = async (courseId: string, chapterId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to publish a chapter" };
  }

  if (!courseId) {
    return { error: "Course ID is required" };
  }

  if (!chapterId) {
    return { error: "Chapter ID is required" };
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

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId: courseId },
    });

    const muxData = await db.muxData.findUnique({
      where: { chapterId: chapterId },
    });

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return { error: "Chapter is incomplete" };
    }

    const publishedChapter = await db.chapter.update({
      data: {
        isPublished: true,
      },
      where: { id: chapterId, courseId: courseId },
    });

    return {
      data: publishedChapter,
      success: "Chapter published successfully",
    };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const unpublishChapter = async (courseId: string, chapterId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to publish a chapter" };
  }

  if (!courseId) {
    return { error: "Course ID is required" };
  }

  if (!chapterId) {
    return { error: "Chapter ID is required" };
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

    const unpublishedChapter = await db.chapter.update({
      data: {
        isPublished: false,
      },
      where: { id: chapterId, courseId: courseId },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return {
      data: unpublishedChapter,
      success: "Chapter unpublished successfully",
    };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};
