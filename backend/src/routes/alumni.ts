import { Router } from 'express';
import { getAllAlumni } from '../repositories/alumniRepo';
import { paginate } from '../utils/paginate';

const r = Router();

// GET /api/alumni?name=&year=&page=&limit=
r.get('/', (req, res) => {
  const { name, year, page, limit } = req.query;

  let list = getAllAlumni();

  if (name && String(name).trim() !== '') {
    const q = String(name).toLowerCase();
    list = list.filter((a) => a.name.toLowerCase().includes(q));
  }

  if (year && !Number.isNaN(Number(year))) {
    const y = Number(year);
    list = list.filter((a) => a.year === y);
  }

  const result = paginate(list, Number(page) || 1, Number(limit) || 10);
  res.json(result);
});

export default r;
