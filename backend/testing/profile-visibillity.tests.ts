import request from "supertest";
import app from "../src/app";
import { getToken } from "./helpers/auth";

describe("Profile Visibility (is_public) API", () => {
  it("GET /api/profile - vraća moj profil (sa tokenom)", async () => {
    const token = await getToken();

    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(typeof res.body.is_public).toBe("boolean");
  });

  it("PUT /api/profile - menja vidljivost profila (javniProfil)", async () => {
    const token = await getToken();

    const res = await request(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ javniProfil: true });

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("is_public", true);
  });

  it("GET /api/profile - odbija bez tokena", async () => {
    const res = await request(app).get("/api/profile");
    expect([401, 403]).toContain(res.status);
  });

  it("PUT /api/profile - odbija bez tokena", async () => {
    const res = await request(app)
      .put("/api/profile")
      .send({ javniProfil: true });

    expect([401, 403]).toContain(res.status);
  });
});
