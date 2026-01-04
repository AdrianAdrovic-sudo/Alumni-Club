import request from "supertest";
import app from "../src/app";

describe("Contact API", () => {
  it("POST /api/contact - uspešno slanje poruke", async () => {
    const res = await request(app).post("/api/contact").send({
      full_name: "Test User",
      email: "test.user@example.com",
      subject: "Test subject",
      message: "Ovo je test poruka.",
    });

    console.log("CONTACT STATUS:", res.status);
    console.log("CONTACT BODY:", res.body);

    expect([200, 201]).toContain(res.status);
    expect(res.body).toBeDefined();

  });

  it("POST /api/contact - validacija (bez message) treba da padne", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "Test",
      email: "test.user@example.com",
    });

    expect([400, 422]).toContain(res.status);
  });
});


