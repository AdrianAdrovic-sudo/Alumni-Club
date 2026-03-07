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

          user_id: 1
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

    const formatted = theses.map(t => ({
      ime: t.first_name ?? "",
      prezime: t.last_name ?? "",
      naziv: t.title ?? "",
      datum: t.year ?? "",
      type: t.type ?? "",
      fileUrl: t.file_url ?? ""
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri dohvatanju radova" });
  }

});

export default router;