const IMAGE_BASE = "https://qciprvblelonmvdwkxam.supabase.co/storage/v1/object/public/hotel-media";

export const mediaBaseUrl = IMAGE_BASE;

export function mediaUrl(filename: string): string {
  if (filename.startsWith('http') || filename.startsWith('/')) return filename;
  return `${IMAGE_BASE}/${filename}`;
}

const knownValidImages = [
  'image_001.jpg', 'image_005.jpg', 'image_006.jpg', 'image_007.jpg', 'image_008.jpg',
  'image_011.jpg', 'image_012.jpg', 'image_013.jpg', 'image_014.jpg', 'image_017.jpg',
  'image_018.jpg', 'image_019.jpg', 'image_020.jpg', 'image_021.jpg', 'image_022.jpg',
  'image_023.jpg', 'image_024.jpg', 'image_025.jpg', 'image_026.jpg', 'image_027.jpg',
  'image_028.jpg', 'image_029.jpg', 'image_030.jpg', 'image_031.jpg', 'image_032.jpg',
  'image_033.jpg', 'image_034.jpg', 'image_035.jpg', 'image_036.jpg', 'image_037.jpg',
  'image_038.jpg', 'image_039.jpg', 'image_040.jpg', 'image_041.jpg', 'image_042.jpg',
  'image_043.jpg', 'image_044.jpg', 'image_045.jpg', 'image_046.jpg', 'image_047.jpg',
  'image_048.jpg', 'image_049.jpg', 'image_050.jpg', 'image_051.jpg', 'image_052.jpg',
  'image_053.jpg', 'image_054.jpg', 'image_055.jpg', 'image_056.jpg', 'image_057.jpg',
  'image_058.jpg', 'image_059.jpg', 'image_060.jpg', 'image_061.jpg', 'image_062.jpg',
  'image_063.jpg', 'image_064.jpg', 'image_065.jpg', 'image_066.jpg', 'image_067.jpg',
  'image_068.jpg', 'image_069.jpg', 'image_070.jpg', 'image_071.jpg', 'image_072.jpg',
  'image_073.jpg', 'image_074.jpg', 'image_075.jpg', 'image_076.jpg', 'image_077.jpg',
  'image_078.jpg', 'image_079.jpg', 'image_080.jpg', 'image_081.jpg', 'image_082.jpg',
  'image_083.jpg', 'image_084.jpg', 'image_085.jpg', 'image_086.jpg', 'image_087.jpg',
  'image_088.jpg'
];

export const mediaImageFiles = knownValidImages;

export const mediaVideoFiles = ["video_01.mp4"];

export const images: string[] = knownValidImages.map(mediaUrl);

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

export const fallbackImage = mediaUrl('image_001.jpg');