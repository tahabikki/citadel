import { uploadFile } from '@/lib/supabase-storage';

export async function upload(file: File, folder: string): Promise<string> {
  return uploadFile(file, folder);
}
