import prisma from "../prisma";

export const createPost = async (userId: number, content: string, imageUrl?: string) => {
  return await prisma.posts.create({
    data: {
      user_id: userId,
      content,
      image_url: imageUrl || null
    }
  });
};
