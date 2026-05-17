import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export async function upload(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeName = file.name.replace(/\s+/g, '-');
  const fileName = `${Date.now()}-${safeName}`;
  const targetDir = path.resolve(process.cwd(), '..', 'backend', 'uploads', folder);
  const filePath = path.join(targetDir, fileName);

  await mkdir(targetDir, { recursive: true });
  await writeFile(filePath, buffer);

  return `/uploads/${folder}/${fileName}`;
}
