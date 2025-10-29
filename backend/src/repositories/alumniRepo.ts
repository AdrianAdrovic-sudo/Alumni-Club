import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../../seed/alumni.json');

export interface Alumni {
  id: number;
  name: string;
  year: number;
}

let alumni: Alumni[] = [];

export function loadAlumni() {
  const data = fs.readFileSync(filePath, 'utf-8');
  alumni = JSON.parse(data);
  console.log(`✅ Alumni loaded: ${alumni.length}`);
}

export function getAllAlumni() {
  return alumni;
}
