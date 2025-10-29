import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "../../seed/blogs.json");

export interface Blog {
  id: number;
  author: string;
  title: string;
  date: string; // ISO
}

let blogs: Blog[] = [];

export function loadBlogs() {
  const data = fs.readFileSync(filePath, "utf-8");
  blogs = JSON.parse(data);
  console.log(`✅ Blogs loaded: ${blogs.length}`);
}

export function getAllBlogs() {
  return blogs;
}
