import { Request, Response } from "express";
import {
  createInquiryAndSendEmail,
  adminListInquiries,
  adminMarkInquiryRead,
  adminDeleteInquiry,
} from "../services/contact.service";

export async function submitContact(req: Request, res: Response) {
  try {
    const { full_name, email, subject, message } = req.body;
    const inquiry = await createInquiryAndSendEmail({
      full_name,
      email,
      subject,
      message,
    });
    res.status(201).json({ ok: true, inquiry });
  } catch (err: any) {
    res.status(400).json({ ok: false, error: err.message || "Bad request" });
  }
}

export async function getAdminInquiries(req: Request, res: Response) {
  try {
    const list = await adminListInquiries();
    res.json({ ok: true, inquiries: list });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
}

export async function markAdminInquiryRead(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ ok: false, error: "Invalid id" });

    const updated = await adminMarkInquiryRead(id);
    res.json({ ok: true, inquiry: updated });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
}

export async function deleteAdminInquiry(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ ok: false, error: "Invalid id" });

    const updated = await adminDeleteInquiry(id);
    res.json({ ok: true, inquiry: updated });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
}
