export async function upload(file: File, folder: string): Promise<string> {
  return URL.createObjectURL(file);
}

export async function deleteFile(url: string): Promise<void> {
  return;
}