import request from "supertest";
import app from "../../src/app";

export async function getToken(): Promise<string> {
  const username = process.env.TEST_USER_USERNAME || "superadmin";
  const password = process.env.TEST_USER_PASSWORD || "Ansar123!";

  const res = await request(app)
    .post("/api/auth/login")
    .send({ username, password });

  const token =
    res.body?.token ||
    res.body?.accessToken ||
    res.body?.jwt ||
    res.body?.data?.token ||
    res.body?.data?.accessToken;

  if (!token) {
    throw new Error(
      `Token nije pronađen u login odgovoru. Status=${res.status}, body=${JSON.stringify(
        res.body
      )}`
    );
  }

  return token;
}




