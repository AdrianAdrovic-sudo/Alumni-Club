import { Router } from "express";
import { getAllNews } from "../repositories/newsRepo";
import { paginate } from "../utils/paginate";

const r = Router();

// GET /api/news?page=&limit=
r.get("/", (req, res) => {
  const { page, limit } = req.query;

  const sorted = [...getAllNews()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const result = paginate(sorted, Number(page) || 1, Number(limit) || 10);
  res.json(result);
});

export default r;
