import { NextRequest, NextResponse } from 'next/server';
import { mediaService } from '@/lib/services/mediaService';
import { deleteFileByUrl } from '@/lib/supabase-storage';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const media = await mediaService.update(id, {
      ...body,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ media });
  } catch (error) {
    console.error('Media PUT error:', error);
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await mediaService.getById(id);
    const deleted = await mediaService.delete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    if (existing?.url) {
      await deleteFileByUrl(existing.url);
    }

    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Media DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
