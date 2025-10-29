import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "../../seed/news.json");

export interface News {
  id: number;
  title: string;
  content: string;
  date: string; // ISO
}

let news: News[] = [];

export function loadNews() {
  const data = fs.readFileSync(filePath, "utf-8");
  news = JSON.parse(data);
  console.log(`✅ News loaded: ${news.length}`);
}

export function getAllNews() {
  return news;
}
