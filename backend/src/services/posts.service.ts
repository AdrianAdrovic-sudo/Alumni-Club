// src/services/posts.service.ts
import prisma from "../prisma";

export const createPost = async (data: {
  userId: number;
  title: string;
  category: string;
  imageUrl?: string;
  readTime?: string;
  shortDesc: string;
  content: string;
}) => {
  return await prisma.posts.create({
    data: {
      user_id: data.userId,
      title: data.title,
      category: data.category,
      image_url: data.imageUrl ?? null,
      read_time: data.readTime ?? null,
      short_desc: data.shortDesc,
      content: data.content,
      is_approved: false, // ide na čekanje
    },
  });
};

export const getApprovedPosts = async () => {
  return await prisma.posts.findMany({
    where: {
      is_approved: true,
      is_deleted: false,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_picture: true,
        },
      },
    },
  });
};

export const getPendingPosts = async () => {
  return await prisma.posts.findMany({
    where: {
      is_approved: false,
      is_deleted: false,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_picture: true,
        },
      },
    },
  });
};

export const approvePost = async (postId: number) => {
  return await prisma.posts.update({
    where: { id: postId },
    data: {
      is_approved: true,
    },
  });
};

export const deletePost = async (postId: number) => {
  return await prisma.posts.update({
    where: { id: postId },
    data: {
      is_deleted: true,
    },
  });
};
export const getPostById = async (postId: number) => {
  return await prisma.posts.findUnique({
    where: { id: postId },
  });
};
