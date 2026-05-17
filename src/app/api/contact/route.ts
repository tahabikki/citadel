import { NextRequest, NextResponse } from 'next/server';
import { contactService } from '@/lib/services/contactService';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as any;

    if (!body.firstName || !body.lastName || !body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const record = await contactService.create({
      firstName: String(body.firstName),
      lastName: String(body.lastName),
      email: String(body.email),
      phone: body.phone ? String(body.phone) : undefined,
      subject: String(body.subject),
      message: String(body.message),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Message received', record }, { status: 201 });
  } catch (error) {
    console.error('Contact POST error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await contactService.getAll();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Contact GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

