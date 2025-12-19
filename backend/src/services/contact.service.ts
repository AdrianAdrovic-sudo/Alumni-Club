import prisma from "../prisma";
import { mailTransporter } from "../config/mail";

type CreateInquiryInput = {
  full_name: string;
  email: string;
  subject: string;
  message: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createInquiryAndSendEmail(input: CreateInquiryInput) {
  const full_name = input.full_name?.trim();
  const email = input.email?.trim();
  const subject = input.subject?.trim();
  const message = input.message?.trim();

  if (!full_name || !email || !subject || !message) {
    throw new Error("All fields are required.");
  }
  if (!isValidEmail(email)) {
    throw new Error("Invalid email address.");
  }

  // 1) Save inquiry
  const inquiry = await prisma.contact_inquiries.create({
    data: { full_name, email, subject, message },
  });

  // 2) Send email
  const to = process.env.CONTACT_INBOX_EMAIL || process.env.ENROLL_TO || process.env.FROM_EMAIL;
  const from = process.env.FROM_EMAIL; // IMPORTANT: do NOT use SMTP_USER ("apikey")

  if (!to) throw new Error("CONTACT_INBOX_EMAIL (or ENROLL_TO / FROM_EMAIL) missing in .env");
  if (!from) throw new Error("FROM_EMAIL missing in .env");

  await mailTransporter.sendMail({
    from,
    to,
    subject: `[Contact] ${subject}`,
    text:
      `New contact inquiry:\n\n` +
      `Name: ${full_name}\n` +
      `Email: ${email}\n` +
      `Subject: ${subject}\n` +
      `Inquiry ID: ${inquiry.id}\n` +
      `Created At: ${inquiry.created_at.toISOString()}\n\n` +
      `Message:\n${message}\n`,
    replyTo: email, // admin can hit Reply in Gmail
  });

  return inquiry;
}

export async function adminListInquiries() {
  return prisma.contact_inquiries.findMany({
    where: { deleted: false },
    orderBy: { created_at: "desc" },
  });
}

export async function adminMarkInquiryRead(id: number) {
  return prisma.contact_inquiries.update({
    where: { id },
    data: { read_at: new Date() },
  });
}

export async function adminDeleteInquiry(id: number) {
  return prisma.contact_inquiries.update({
    where: { id },
    data: { deleted: true },
  });
}
