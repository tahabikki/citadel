const unsplashBase = "https://images.unsplash.com";

export const mediaBaseUrl = unsplashBase;
export const mediaImageFiles = [
  "photo-1631049307264-da0ec9d70304",
  "photo-1611892440504-42a792e24d32",
  "photo-1590490360182-c33d57733427",
  "photo-1566665797739-1674de7a421a",
  "photo-1582719478250-c89cae4dc85b",
  "photo-1618773928121-c32242e63f39",
];

export function mediaUrl(filename: string) {
  if (filename.startsWith('http') || filename.startsWith('/')) return filename;
  return `${unsplashBase}/${filename}?w=800&h=600&fit=crop`;
}

export const images: string[] = mediaImageFiles.map(mediaUrl);
export const videos: string[] = [];

export const roomImages = {
  single: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
  double: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
  twin: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
  family: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop",
  suite: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
};

export const hotelImages = {
  exterior: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
  lobby: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
};