import { Request, Response } from "express";
import prisma from "../prisma";

export const getAlumniDirectory = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        first_name: true,
        last_name: true,
        occupation: true,
        profile_picture: true,
        is_public: true
      },
      orderBy: { first_name: "asc" },
    });

    return res.json({ users });
  } catch (error) {
    console.error("Directory load error:", error);
    return res.status(500).json({ message: "Server error loading directory" });
  }
};

export const getAlumniProfile = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        first_name: true,
        last_name: true,
        email: true,
        occupation: true,
        enrollment_year: true,
        profile_picture: true,
        is_public: true,
        work_location: true,
        position: true,
        study_direction: true,
        study_level: true,
        cv_url: true,
        created_at: true
      },
    });

    console.log("Found user:", user);
    console.log("User position:", user?.position);
    console.log("User study_level:", user?.study_level);
    console.log("User study_direction:", user?.study_direction);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.is_public) {
      return res.status(403).json({ message: "Profile is private" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Profile load error:", error);
    return res.status(500).json({ message: "Server error loading profile" });
  }
};
