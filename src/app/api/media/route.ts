import { NextRequest, NextResponse } from 'next/server';
import { mediaService } from '@/lib/services/mediaService';

export async function GET() {
  try {
    const media = await mediaService.getAll();
    return NextResponse.json({ media });
  } catch (error) {
    console.error('Media GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.url || !body.filename || !body.type) {
      return NextResponse.json({ error: 'Missing required media fields' }, { status: 400 });
    }

    const media = await mediaService.create({
      url: String(body.url),
      filename: String(body.filename),
      type: String(body.type),
      isActive: body.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    console.error('Media POST error:', error);
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 });
  }
}
