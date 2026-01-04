import request from "supertest";
import app from "../src/app";

describe("Enroll API", () => {
  it("POST /api/enroll - uspešna prijava (public endpoint)", async () => {
    const res = await request(app).post("/api/enroll").send({
      name: "Test User",
      email: "test.user@example.com",
      message: "Test prijava za Alumni Club.",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("inquiryId");
  });

  it("POST /api/enroll - validacija (missing fields) treba da padne", async () => {
    const res = await request(app).post("/api/enroll").send({
      name: "Test User",
      message: "Bez email-a",
    });

    expect(res.status).toBe(400);
  });
});



