const IMAGE_BASE = "https://qciprvblelonmvdwkxam.supabase.co/storage/v1/object/public/hotel-media";

export const mediaBaseUrl = IMAGE_BASE;

function padNumber(num: number): string {
  return num.toString().padStart(3, '0');
}

export function mediaUrl(filename: string) {
  if (filename.startsWith('http') || filename.startsWith('/')) return filename;
  return `${IMAGE_BASE}/${filename}`;
}

export const mediaImageFiles: string[] = Array.from({ length: 88 }, (_, i) => `image_${padNumber(i + 1)}.jpg`);

export const mediaVideoFiles: string[] = ["video_01.mp4"];

export const images: string[] = mediaImageFiles.map(mediaUrl);
export const videos: string[] = mediaVideoFiles.map(mediaUrl);

export const roomImages = {
  single: `${IMAGE_BASE}/image_001.jpg`,
  double: `${IMAGE_BASE}/image_005.jpg`,
  twin: `${IMAGE_BASE}/image_006.jpg`,
  family: `${IMAGE_BASE}/image_007.jpg`,
  suite: `${IMAGE_BASE}/image_008.jpg`,
};

export const hotelImages = {
  exterior: `${IMAGE_BASE}/image_011.jpg`,
  lobby: `${IMAGE_BASE}/image_012.jpg`,
  restaurant: `${IMAGE_BASE}/image_013.jpg`,
};