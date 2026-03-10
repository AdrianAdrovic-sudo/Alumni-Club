import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import prisma from "../prisma";

const router = express.Router();
const uploadsRoot = path.join(__dirname, "..", "..", "uploads");
const csvUploadsDir = uploadsRoot;
const pdfUploadsDir = path.join(uploadsRoot, "pdfs");

if (!fs.existsSync(csvUploadsDir)) {
  fs.mkdirSync(csvUploadsDir, { recursive: true });
}

if (!fs.existsSync(pdfUploadsDir)) {
  fs.mkdirSync(pdfUploadsDir, { recursive: true });
}

const upload = multer({ dest: csvUploadsDir });

router.post("/upload-csv", upload.single("file"), async (req, res) => {
  const results: any[] = [];

  if (!req.file) {
    return res.status(400).json({ message: "CSV fajl nije poslat" });
  }

  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const thesesData = results.map((row) => ({
          first_name: (row.first_name || "").trim(),
          last_name: (row.last_name || "").trim(),
          title: (row.title || "").trim(),
          type: (row.type || "").trim().toLowerCase(),
          year: row.year && !isNaN(Number(row.year)) ? Number(row.year) : null,
          file_url: (row.file_url || "").trim(),
          mentor: row.mentor ? (row.mentor || "").trim() : null,
          committee_members: row.committee_members ? (row.committee_members || "").trim() : null,
          grade: row.grade ? (row.grade || "").trim().toUpperCase() : null,
          topic: row.topic ? (row.topic || "").trim() : null,
          keywords: row.keywords ? (row.keywords || "").trim() : null,
          language: row.language ? (row.language || "").trim() : null,
          abstract: row.abstract ? (row.abstract || "").trim() : null,
          user_id: row.user_id && !isNaN(Number(row.user_id)) ? Number(row.user_id) : 1,
        }));

        await prisma.theses.createMany({
          data: thesesData,
        });

        fs.unlinkSync(filePath);

        res.json({
          message: "CSV uspjesno importovan",
          count: thesesData.length,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greska pri importu CSV" });
      }
    });
});

router.get("/", async (req, res) => {
  try {
    const theses = await prisma.theses.findMany({
      orderBy: {
        year: "desc",
      },
    });

    const formatted = theses.map((t: any) => ({
      id: t.id,
      first_name: t.first_name,
      last_name: t.last_name,
      title: t.title,
      date: t.year ? `01.07.${t.year}.` : "",
      type: t.type,
      fileUrl: t.file_url,
      year: t.year,
      mentor: t.mentor,
      committee_members: t.committee_members,
      grade: t.grade,
      topic: t.topic,
      keywords: t.keywords,
      language: t.language,
      abstract: t.abstract,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greska pri dohvatanju radova" });
  }
});

const thesisPdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfUploadsDir);
  },
  filename: (req, file, cb) => {
    const originalExt = path.extname(file.originalname).toLowerCase();
    const ext = originalExt === ".pdf" ? originalExt : ".pdf";
    const baseName =
      path
        .basename(file.originalname, path.extname(file.originalname))
        .replace(/[^a-zA-Z0-9_-]+/g, "_")
        .replace(/^_+|_+$/g, "") || "thesis";

    cb(null, `${Date.now()}_${baseName}${ext}`);
  },
});

const pdfUpload = multer({
  storage: thesisPdfStorage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Dozvoljeni su samo PDF fajlovi"));
    }

    cb(null, true);
  },
});

router.post("/upload-pdf/:id", pdfUpload.single("file"), async (req, res) => {
  try {
    const thesisId = Number(req.params.id);
    const { type, title, year } = req.body as {
      type?: string;
      title?: string;
      year?: string;
    };

    if (!thesisId || Number.isNaN(thesisId)) {
      return res.status(400).json({ message: "Neispravan ID rada" });
    }

    const existingThesis = await prisma.theses.findUnique({
      where: { id: thesisId },
      select: { file_url: true },
    });

    if (!existingThesis) {
      return res.status(404).json({ message: "Rad nije pronadjen" });
    }

    if (!req.file && !existingThesis.file_url) {
      return res.status(400).json({ message: "PDF nije poslat" });
    }

    const allowedTypes = ["bachelors", "masters", "specialist"];
    const normalizedType = (type || "").trim().toLowerCase();

    if (!allowedTypes.includes(normalizedType)) {
      return res.status(400).json({ message: "Neispravan tip studija" });
    }

    const updateData: {
      file_url?: string;
      type: string;
      title?: string;
      year?: number;
    } = {
      type: normalizedType,
    };

    if (req.file) {
      updateData.file_url = `/uploads/pdfs/${req.file.filename}`;
    }

    if (typeof title === "string" && title.trim()) {
      updateData.title = title.trim();
    }

    if (typeof year === "string" && year.trim()) {
      const parsedYear = Number(year);

      if (Number.isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
        return res.status(400).json({ message: "Godina mora biti izmedju 1900 i 2100" });
      }

      updateData.year = parsedYear;
    }

    const updatedThesis = await prisma.theses.update({
      where: { id: thesisId },
      data: updateData,
    });

    res.json({
      message: req.file ? "PDF uspjesno otpremljen" : "Podaci rada uspjesno azurirani",
      thesis: {
        id: updatedThesis.id,
        title: updatedThesis.title,
        type: updatedThesis.type,
        year: updatedThesis.year,
        fileUrl: updatedThesis.file_url,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greska pri uploadu PDF" });
  }
});

export default router;
