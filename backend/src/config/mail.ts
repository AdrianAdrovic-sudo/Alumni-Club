import nodemailer from "nodemailer";

export const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

mailTransporter.verify()
  .then(() => console.log("SMTP ready (SendGrid)"))
  .catch(err => console.error("SMTP error:", err));
