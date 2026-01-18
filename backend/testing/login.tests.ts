import request from "supertest";
import app from "../src/app";
import { describe, it, expect } from "@jest/globals";

describe("Auth Login API", () => {
  it("POST /api/auth/login - uspješan login vraća token i user", async () => {
    const username = process.env.TEST_USER_USERNAME || "superadmin";
    const password = process.env.TEST_USER_PASSWORD || "Ansar123!";

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username, password });

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
    expect(res.body).toHaveProperty("user");
  });

  it("POST /api/auth/login - pogrešni podaci se odbijaju", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "wrong", password: "wrong" });

    expect([400, 401]).toContain(res.status);
  });
});
