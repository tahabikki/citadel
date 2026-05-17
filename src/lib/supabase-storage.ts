import { createClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'hotel-media';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseStorageAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase storage environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getStoragePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) return null;
  return decodeURIComponent(url.slice(markerIndex + marker.length).split('?')[0]);
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  folder: string = 'uploads'
): Promise<string> {
  try {
    const supabaseStorageAdmin = getSupabaseStorageAdmin();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const filename = `${Date.now()}-${safeName}`;
    const filepath = folder ? `${folder}/${filename}` : filename;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let error: any = null;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      const result = await supabaseStorageAdmin.storage
        .from(BUCKET_NAME)
        .upload(filepath, buffer, {
          cacheControl: '3600',
          contentType: file.type || 'application/octet-stream',
          upsert: false,
        });

      error = result.error;
      if (!error) break;

      const message = String(error.message || error);
      const isTransient = /bad gateway|econnreset|fetch failed|network|timeout/i.test(message);
      if (!isTransient || attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    if (error) throw error;

    // Get the public URL
    const { data: publicUrl } = supabaseStorageAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filepath);

    return publicUrl.publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(filepath: string): Promise<void> {
  try {
    const supabaseStorageAdmin = getSupabaseStorageAdmin();
    const { error } = await supabaseStorageAdmin.storage
      .from(BUCKET_NAME)
      .remove([filepath]);

    if (error) throw error;
  } catch (error) {
    console.error('File deletion error:', error);
    throw error;
  }
}

export async function deleteFileByUrl(url: string): Promise<void> {
  const filepath = getStoragePathFromUrl(url);
  if (!filepath) return;
  await deleteFile(filepath);
}

/**
 * List files in a folder
 */
export async function listFiles(folder: string): Promise<string[]> {
  try {
    const supabaseStorageAdmin = getSupabaseStorageAdmin();
    const { data, error } = await supabaseStorageAdmin.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) throw error;

    return data.map((file: { name: string }) => file.name);
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Get a signed URL for a file (for private storage)
 */
export async function getSignedUrl(filepath: string, expiresIn: number = 3600): Promise<string> {
  try {
    const supabaseStorageAdmin = getSupabaseStorageAdmin();
    const { data, error } = await supabaseStorageAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filepath, expiresIn);

    if (error) throw error;

    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
}
