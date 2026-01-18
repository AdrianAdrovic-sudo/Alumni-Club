import request from "supertest";
import app from "../src/app";
import { describe, it, expect } from "@jest/globals";

import { getToken } from "./helpers/auth";

describe("Messages (Inbox basics) API", () => {
  it("Send → Inbox → Sent → Mark as read", async () => {
    const token = await getToken();
    const username = process.env.TEST_USER_USERNAME || "superadmin";

    // SEND MESSAGE
    const sendRes = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({
        receiverUsername: username,
        subject: "Test subject",
        content: "Test content",
      });

    expect([200, 201]).toContain(sendRes.status);

    const message = sendRes.body?.message || sendRes.body?.messages?.[0];

    expect(message).toBeDefined();
    const messageId = message.id;

    // SENT
    const sentRes = await request(app)
      .get("/api/messages/sent")
      .set("Authorization", `Bearer ${token}`);

    expect(sentRes.status).toBe(200);
    expect(Array.isArray(sentRes.body.messages)).toBe(true);

    // INBOX
    const inboxRes = await request(app)
      .get("/api/messages/inbox")
      .set("Authorization", `Bearer ${token}`);

    expect(inboxRes.status).toBe(200);
    expect(Array.isArray(inboxRes.body.messages)).toBe(true);

    // MARK AS READ
    const readRes = await request(app)
      .patch(`/api/messages/${messageId}/read`)
      .set("Authorization", `Bearer ${token}`);

    expect(readRes.status).toBe(200);
  });

  it("GET /api/messages/inbox - odbija bez tokena", async () => {
    const res = await request(app).get("/api/messages/inbox");
    expect([401, 403]).toContain(res.status);
  });
});
