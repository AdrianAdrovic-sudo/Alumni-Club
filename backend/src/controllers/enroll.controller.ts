// backend/src/controllers/enroll.controller.ts
import { Request, Response } from "express";
import prisma from "../prisma";
import { mailTransporter } from "../config/mail";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const sendEnrollApplication = async (req: Request, res: Response) => {
  const name = (req.body?.name || "").trim();
  const email = (req.body?.email || "").trim();
  const message = (req.body?.message || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  try {
    // 1) SAVE into DB so admin can see it in Dashboard -> Inquiries
    // We reuse contact_inquiries. We mark it with [Enroll] prefix in subject.
    const subject = `[Enroll] Nova prijava za Alumni Club: ${name}`;

    const inquiry = await prisma.contact_inquiries.create({
      data: {
        full_name: name,
        email,
        subject,
        message,
      },
    });

    // 2) Send email to admin inbox (your existing behaviour)
    const textBody =
      `Nova prijava za Alumni Club\n\n` +
      `Ime i prezime: ${name}\n` +
      `Email: ${email}\n` +
      `Inquiry ID: ${inquiry.id}\n` +
      `Created At: ${inquiry.created_at.toISOString()}\n\n` +
      `Poruka:\n${message}\n`;

    const htmlBody = `
      <h2>Nova prijava za Alumni Club</h2>
      <p><strong>Ime i prezime:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Inquiry ID:</strong> ${inquiry.id}</p>
      <p><strong>Created At:</strong> ${inquiry.created_at.toISOString()}</p>
      <p><strong>Poruka:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

    const to =
      process.env.ENROLL_TO ||
      process.env.CONTACT_INBOX_EMAIL ||
      process.env.FROM_EMAIL;

    const from = process.env.FROM_EMAIL;

    if (!to) {
      return res.status(500).json({
        error: "Missing ENROLL_TO (or CONTACT_INBOX_EMAIL / FROM_EMAIL) in .env",
      });
    }
    if (!from) {
      return res.status(500).json({
        error: "Missing FROM_EMAIL in .env",
      });
    }

    await mailTransporter.sendMail({
      from: `"Alumni Club" <${from}>`,
      to,
      replyTo: email,
      subject: `Nova prijava za Alumni Club: ${name}`,
      text: textBody,
      html: htmlBody,
    });

    // 3) Confirmation back to applicant
    await mailTransporter.sendMail({
      from: `"Alumni Club" <${from}>`,
      to: email,
      subject: "Vaša prijava za Alumni Club je zaprimljena",
      text:
        "Poštovani,\n\nVaša prijava za Alumni Club je uspješno poslata. Fakultet će vas kontaktirati nakon pregleda.\n\nSrdačan pozdrav,\nFIT Alumni Club",
    });

    return res.status(200).json({ success: true, inquiryId: inquiry.id });
  } catch (error) {
    console.error("Enroll error:", error);
    return res.status(500).json({ error: "Failed to process enrollment." });
  }
};
