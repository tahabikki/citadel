import { NextResponse } from 'next/server';
import { uploadService } from '@/lib/services/uploadService';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const kind = formData.get('kind');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const normalizedKind = String(kind || 'image').toLowerCase();
    const url =
      normalizedKind === 'file'
        ? await uploadService.uploadFile(file)
        : await uploadService.uploadImage(file);

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
