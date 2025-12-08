// backend/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import { mailTransporter } from "../config/mail";
import { storeResetCode, verifyResetCode } from "../utils/resetCodeStore";

/**
 * STEP 1: provjera korisničkog imena i emaila + slanje koda
 * POST /api/auth/reset-check
 * body: { username, email }
 */
export async function resetCheck(req: Request, res: Response) {
  const { username, email } = req.body as {
    username?: string;
    email?: string;
  };

  if (!username || !email) {
    return res
      .status(400)
      .json({ message: "Korisničko ime i email su obavezni." });
  }

  try {
    const user = await prisma.users.findFirst({
      where: { username, email },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Nije pronađen korisnik sa datim podacima." });
    }

    // 6-cifreni kod
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // snimi kod u memoriju
    storeResetCode(user.username, user.email, code);

    const from =
      process.env.FROM_EMAIL ||
      process.env.SMTP_USER ||
      "no-reply@alumni.local";

    await mailTransporter.sendMail({
      from: `"FIT Alumni Club" <${from}>`,
      to: user.email,
      subject: "Kod za resetovanje šifre",
      text: `Poštovani ${user.username},

Zatražen je reset šifre za vaš Alumni Club nalog.

Vaš kod za resetovanje šifre je: ${code}

Kod važi 10 minuta.

Ako niste vi tražili promjenu šifre, ignorišite ovaj email.

Srdačan pozdrav,
FIT Alumni Club`,
    });

    return res.json({
      message:
        "Kod za reset šifre je poslat na vašu email adresu. Provjerite inbox.",
    });
  } catch (error) {
    console.error("reset-check error:", error);
    return res.status(500).json({
      message: "Došlo je do greške. Pokušajte ponovo.",
    });
  }
}

/**
 * STEP 2: potvrda koda i promjena šifre
 * POST /api/auth/reset-confirm
 * body: { username, email, code, newPassword }
 */
export async function resetConfirm(req: Request, res: Response) {
  const { username, email, code, newPassword } = req.body as {
    username?: string;
    email?: string;
    code?: string;
    newPassword?: string;
  };

  if (!username || !email || !code || !newPassword) {
    return res.status(400).json({
      message: "Korisničko ime, email, kod i nova šifra su obavezni.",
    });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Šifra mora imati najmanje 6 karaktera." });
  }

  try {
    // 1) provjeri kod
    const valid = verifyResetCode(username, email, code);
    if (!valid) {
      return res.status(400).json({
        message: "Kod nije ispravan ili je istekao.",
      });
    }

    // 2) pronađi korisnika
    const user = await prisma.users.findFirst({
      where: { username, email },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Nije pronađen korisnik sa datim podacima." });
    }

    // 3) promijeni šifru
    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { id: user.id },
      data: { password_hash: hashed },
    });

    return res.json({ message: "Šifra je uspješno promijenjena." });
  } catch (error) {
    console.error("reset-confirm error:", error);
    return res
      .status(500)
      .json({ message: "Došlo je do greške. Pokušajte ponovo." });
  }
}
