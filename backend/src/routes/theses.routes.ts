import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import prisma from "../prisma";
import { authenticate } from "../middlewares/auth.middleware";

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
        const thesesData = results.map((row) => {
          const parsedYear = Number(row.year);
          if (Number.isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
            throw new Error("CSV sadrzi neispravnu godinu.");
          }

          return {
            first_name: (row.first_name || "").trim(),
            last_name: (row.last_name || "").trim(),
            title: (row.title || "").trim(),
            subtitle: row.subtitle ? (row.subtitle || "").trim() : null,
            title_language: (row.title_language || row.titleLanguage || row.language || "en").trim(),
            additional_title: row.additional_title ? (row.additional_title || "").trim() : null,
            additional_subtitle: row.additional_subtitle ? (row.additional_subtitle || "").trim() : null,
            additional_title_language: row.additional_title_language
              ? (row.additional_title_language || "").trim()
              : null,
            type: (row.type || "").trim().toLowerCase(),
            year: parsedYear,
            file_url: (row.file_url || "").trim(),
            mentor: row.mentor ? (row.mentor || "").trim() : null,
            committee_members: row.committee_members ? (row.committee_members || "").trim() : null,
            grade: row.grade ? (row.grade || "").trim().toUpperCase() : null,
            topic: row.topic ? (row.topic || "").trim() : null,
            keywords: row.keywords ? (row.keywords || "").trim() : null,
            language: row.language ? (row.language || "").trim() : null,
            abstract: row.abstract ? (row.abstract || "").trim() : null,
            user_id: row.user_id && !isNaN(Number(row.user_id)) ? Number(row.user_id) : 1,
          };
        });

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

router.post("/", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      title,
      subtitle,
      title_language,
      additional_title,
      additional_subtitle,
      additional_title_language,
      type,
      year,
      file_url,
      mentor,
      committee_members,
      grade,
      topic,
      keywords,
      language,
      abstract,
      user_id,
    } = req.body;

    if (!first_name || !last_name || !title || !title_language || !type || !user_id) {
      return res.status(400).json({ message: "Obavezna polja nisu popunjena" });
    }

    const parsedYear = Number(year);
    if (Number.isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      return res.status(400).json({ message: "Godina mora biti izmedju 1900 i 2100" });
    }

    const newThesis = await prisma.theses.create({
      data: {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        title: title.trim(),
        subtitle: subtitle ? subtitle.trim() : null,
        title_language: title_language.trim(),
        additional_title: additional_title ? additional_title.trim() : null,
        additional_subtitle: additional_subtitle ? additional_subtitle.trim() : null,
        additional_title_language: additional_title_language ? additional_title_language.trim() : null,
        type: type.trim().toLowerCase(),
        year: parsedYear,
        file_url: file_url || "",
        mentor: mentor || null,
        committee_members: committee_members || null,
        grade: grade || null,
        topic: topic || null,
        keywords: keywords || null,
        language: language || null,
        abstract: abstract || null,
        user_id,
      },
    });

    res.json({
      message: "Rad uspjesno dodat",
      thesis: newThesis,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greska pri dodavanju rada" });
  }
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
      user_id: t.user_id,
      first_name: t.first_name,
      last_name: t.last_name,
      title: t.title,
      subtitle: t.subtitle,
      title_language: t.title_language,
      additional_title: t.additional_title,
      additional_subtitle: t.additional_subtitle,
      additional_title_language: t.additional_title_language,
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

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const thesisId = Number(req.params.id);
    if (!thesisId || Number.isNaN(thesisId)) {
      return res.status(400).json({ message: "Neispravan ID rada" });
    }

    const existingThesis = await prisma.theses.findUnique({
      where: { id: thesisId },
      select: { file_url: true, user_id: true },
    });

    if (!existingThesis) {
      return res.status(404).json({ message: "Rad nije pronadjen" });
    }

    if (req.user?.role !== "admin" && req.user?.id !== existingThesis.user_id) {
      return res.status(403).json({ message: "Nemate pravo da obrisete ovaj rad" });
    }

    await prisma.theses.delete({ where: { id: thesisId } });

    if (existingThesis.file_url && existingThesis.file_url.startsWith("/uploads/")) {
      const relativePath = existingThesis.file_url.replace(/^\/uploads\//, "");
      const filePath = path.join(uploadsRoot, relativePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: "Rad uspjesno obrisan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greska pri brisanju rada" });
  }
});

export default router;
