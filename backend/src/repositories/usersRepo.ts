import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "../../seed/users.json");

export interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [];

export function loadUsers() {
  const data = fs.readFileSync(filePath, "utf-8");
  users = JSON.parse(data);
  console.log(`✅ Users loaded: ${users.length}`);
}

export function getAllUsers() {
  return users;
}

export function addUser(user: Omit<User, "id">) {
  const newUser: User = { id: users.length + 1, ...user };
  users.push(newUser);
  return newUser;
}
