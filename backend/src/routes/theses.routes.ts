import express from "express";
import multer from "multer";
import fs from "fs";
import csv from "csv-parser";
import prisma from "../prisma";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

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
          year: row.year && !isNaN(Number(row.year))
            ? Number(row.year)
            : null,
          file_url: (row.file_url || "").trim(),
          user_id: row.user_id && !isNaN(Number(row.user_id))
            ? Number(row.user_id)
            : 1
        }));

        await prisma.theses.createMany({
          data: thesesData
        });

        fs.unlinkSync(filePath);

        res.json({
          message: "CSV uspješno importovan",
          count: thesesData.length
        });

      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greška pri importu CSV" });
      }
    });
});

router.get("/", async (req, res) => {

  try {

    const theses = await prisma.theses.findMany({
      orderBy: {
        year: "desc"
      }
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
      // Novi podaci za statistiku
      mentor: t.mentor,
      committee_members: t.committee_members,
      grade: t.grade,
      topic: t.topic,
      keywords: t.keywords
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri dohvatanju radova" });
  }

});

const pdfUpload = multer({ dest: "uploads/pdfs/" });

router.post("/upload-pdf/:id", pdfUpload.single("file"), async (req, res) => {
  try {

    const thesisId = Number(req.params.id);

    if (!req.file) {
      return res.status(400).json({ message: "PDF nije poslat" });
    }

    const fileUrl = `http://localhost:4000/uploads/pdfs/${req.file.filename}`;

    await prisma.theses.update({
      where: { id: thesisId },
      data: {
        file_url: fileUrl
      }
    });

    res.json({
      message: "PDF uspješno otpremljen",
      fileUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri uploadu PDF" });
  }
});

export default router;