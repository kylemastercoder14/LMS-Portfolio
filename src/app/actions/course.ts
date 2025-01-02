"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export const createCourse = async (title: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to create a course" };
  }

  if (!title) {
    return { error: "Title is required" };
  }

  try {
    const response = await db.course.create({
      data: {
        userId,
        title: title,
      },
    });

    return { id: response.id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const addCourseDescription = async (
  description: string,
  courseId: string
) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to create a course" };
  }

  if (!description) {
    return { error: "Description is required" };
  }

  try {
    await db.course.update({
      data: {
        userId,
        description: description,
      },
      where: { id: courseId, userId },
    });
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const addCourseCategory = async (category: string, courseId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to create a course" };
  }

  if (!category) {
    return { error: "Category is required" };
  }

  try {
    await db.course.update({
      data: {
        userId,
        categoryId: category,
      },
      where: { id: courseId, userId },
    });
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const addCourseAttachment = async (
  attachment: string,
  courseId: string
) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to create a course" };
  }

  if (!attachment) {
    return { error: "Attachment is required" };
  }

  try {
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return { error: "You are not the owner of this course" };
    }

    const attachments = await db.attachment.create({
      data: {
        url: attachment,
        name: attachment.split("/").pop() || "",
        courseId: courseId,
      },
    });

    return { attachment: attachments };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const deleteCourseAttachment = async (
  attachmentId: string,
  courseId: string
) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to delete attachment" };
  }

  if (!attachmentId) {
    return { error: "Attachment is required" };
  }

  try {
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return { error: "You are not the owner of this course" };
    }

    await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const addPriceCategory = async (price: number, courseId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to create a course" };
  }

  if (!price) {
    return { error: "Price is required" };
  }

  try {
    await db.course.update({
      data: {
        userId,
        price: price,
      },
      where: { id: courseId, userId },
    });
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const addCourseImage = async (imageUrl: string, courseId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to create a course" };
  }

  if (!imageUrl) {
    return { error: "Image is required" };
  }

  try {
    await db.course.update({
      data: {
        userId,
        imageUrl: imageUrl,
      },
      where: { id: courseId, userId },
    });
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const updateCourseTitle = async (title: string, courseId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to create a course" };
  }

  if (!courseId) {
    return { error: "Course ID is required" };
  }

  if (!title) {
    return { error: "Title is required" };
  }

  try {
    const response = await db.course.update({
      data: {
        title: title,
      },
      where: { id: courseId, userId },
    });

    return { id: response.id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const deleteCourse = async (courseId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to delete a course" };
  }

  if (!courseId) {
    return { error: "Course ID is required" };
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData) {
        await mux.video.assets.delete(chapter.muxData.assetId);
      }
    }

    await db.course.delete({
      where: { id: courseId },
    });

    return { success: "Course deleted successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const publishCourse = async (courseId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to publish a course" };
  }

  if (!courseId) {
    return { error: "Course ID is required" };
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.title ||
      !course.description ||
      !course.categoryId ||
      !course.imageUrl ||
      !course.price ||
      !hasPublishedChapter
    ) {
      return {
        error:
          "Please complete all the required fields before publishing the course",
      };
    }

    await db.course.update({
      data: {
        isPublished: true,
      },
      where: { id: courseId, userId },
    });

    return { success: "Course published successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const unpublishCourse = async (courseId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be logged in to publish a course" };
  }

  if (!courseId) {
    return { error: "Course ID is required" };
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    await db.course.update({
      data: {
        isPublished: false,
      },
      where: { id: courseId, userId },
    });

    return { success: "Course unpublished successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};
