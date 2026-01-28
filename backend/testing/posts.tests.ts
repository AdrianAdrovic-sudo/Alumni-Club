import request from "supertest";
import app from "../src/app";
import { getToken } from "./helpers/auth";
import { describe, it, expect } from "@jest/globals";

describe("Blog Posts API", () => {
  it("GET /api/posts - javna lista postova", async () => {
    const res = await request(app).get("/api/posts");

    expect(res.status).toBe(200);

    const body = res.body;
    const posts = Array.isArray(body) ? body : body.posts || body.data || [];

    expect(Array.isArray(posts)).toBe(true);
  });

  it("POST /api/posts - ulogovani korisnik može kreirati post", async () => {
    const token = await getToken();

    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test post",
        category: "Testing",
        shortDesc: "Short description",
        content: "Full content",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("title", "Test post");
    expect(res.body).toHaveProperty("is_approved", false);
  });

  it("POST /api/posts - odbija bez tokena", async () => {
    const res = await request(app).post("/api/posts").send({
      title: "X",
      category: "Y",
      shortDesc: "Z",
      content: "W",
    });

    expect([401, 403]).toContain(res.status);
  });
});
