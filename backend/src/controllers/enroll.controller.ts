// backend/src/controllers/enroll.controller.ts
import { Request, Response } from "express";
import { mailTransporter } from "../config/mail";

export const sendEnrollApplication = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const subject = `Nova prijava za Alumni Club: ${name}`;

    const textBody = `
Nova prijava za Alumni Club

Ime i prezime: ${name}
Email: ${email}

Poruka:
${message}
`;

    const htmlBody = `
      <h2>Nova prijava za Alumni Club</h2>
      <p><strong>Ime i prezime:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Poruka:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

    // send to school/test address
    await mailTransporter.sendMail({
      from: `"Alumni Club" <${process.env.SMTP_USER}>`,
      to: process.env.ENROLL_TO,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    // optional confirmation back to applicant
    await mailTransporter.sendMail({
      from: `"Alumni Club" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Vaša prijava za Alumni Club je zaprimljena",
      text:
        "Poštovani,\n\nVaša prijava za Alumni Club je uspješno poslata. Fakultet će vas kontaktirati nakon pregleda.\n\nSrdačan pozdrav,\nFIT Alumni Club",
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Enroll mail error:", error);
    return res
      .status(500)
      .json({ error: "Failed to send application email." });
  }
};
