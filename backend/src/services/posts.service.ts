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

export const getApprovedPosts = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  
  const [posts, total] = await Promise.all([
    prisma.posts.findMany({
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
      select: {
        id: true,
        title: true,
        category: true,
        image_url: true,
        read_time: true,
        short_desc: true,
        content: true,
        created_at: true,
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_picture: true,
          },
        },
      },
      skip,
      take: limit,
    }),
    prisma.posts.count({
      where: {
        is_approved: true,
        is_deleted: false,
      },
    })
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
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
          username: true,
        },
      },
      _count: {
        select: {
          comments: true,
          post_likes: true,
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

export const updatePost = async (postId: number, data: {
  title?: string;
  category?: string;
  short_desc?: string;
  content?: string;
  read_time?: string;
}) => {
  return await prisma.posts.update({
    where: { id: postId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.category && { category: data.category }),
      ...(data.short_desc && { short_desc: data.short_desc }),
      ...(data.content && { content: data.content }),
      ...(data.read_time !== undefined && { read_time: data.read_time || null }),
    },
  });
};

export const getPostById = async (postId: number) => {
  return await prisma.posts.findUnique({
    where: { id: postId },
  });
};
