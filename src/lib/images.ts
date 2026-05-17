import mediaManifest from '../../public/uploads/media/hotel/media.json';

export const mediaBaseUrl = mediaManifest.baseUrl;
export const mediaImageFiles = mediaManifest.images;
export const mediaVideoFiles = mediaManifest.videos;

export function mediaUrl(filename: string) {
  if (filename.startsWith('http') || filename.startsWith('/')) return filename;
  return `${mediaBaseUrl}/${filename}`;
}

export const images: string[] = mediaImageFiles.map(mediaUrl);
export const videos: string[] = mediaVideoFiles.map(mediaUrl);

export const roomImages = {
  single: mediaUrl('image_001.jpg'),
  double: mediaUrl('image_005.jpg'),
  twin: mediaUrl('image_006.jpg'),
  family: mediaUrl('image_007.jpg'),
  suite: mediaUrl('image_008.jpg'),
};

export const hotelImages = {
  exterior: mediaUrl('image_011.jpg'),
  lobby: mediaUrl('image_012.jpg'),
  restaurant: mediaUrl('image_013.jpg'),
};
