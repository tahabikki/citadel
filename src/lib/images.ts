const supabaseBase = "https://qciprvblelonmvdwkxam.supabase.co/storage/v1/object/public/hotel-media";

export const mediaBaseUrl = supabaseBase;

function padNumber(num: number): string {
  return num.toString().padStart(3, '0');
}

export function mediaUrl(filename: string) {
  if (filename.startsWith('http') || filename.startsWith('/')) return filename;
  return `${supabaseBase}/${filename}`;
}

export const mediaImageFiles: string[] = Array.from({ length: 88 }, (_, i) => `image_${padNumber(i + 1)}.jpg`);

export const mediaVideoFiles: string[] = ["video_01.mp4"];

export const images: string[] = mediaImageFiles.map(mediaUrl);
export const videos: string[] = mediaVideoFiles.map(mediaUrl);

export const roomImages = {
  single: `${supabaseBase}/image_001.jpg`,
  double: `${supabaseBase}/image_005.jpg`,
  twin: `${supabaseBase}/image_006.jpg`,
  family: `${supabaseBase}/image_007.jpg`,
  suite: `${supabaseBase}/image_008.jpg`,
};

export const hotelImages = {
  exterior: `${supabaseBase}/image_011.jpg`,
  lobby: `${supabaseBase}/image_012.jpg`,
  restaurant: `${supabaseBase}/image_013.jpg`,
};