import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactSchema } from '@/validators/schema';
import { getCorsHeaders } from '@/lib/cors';

// OPTIONS : gérer le préflight CORS
export function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  const headers = getCorsHeaders(origin);
  return new NextResponse(null, { status: 200, headers });
}

// GET: récupérer les contacts
export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  const headers = getCorsHeaders(origin);

  try {
    const contacts = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(contacts, { headers });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch contacts' },
      { status: 500, headers }
    );
  }
}

// POST: créer un contact
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const headers = getCorsHeaders(origin);

  try {
    const data = await req.json();
    const parsed = contactSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ status: 'error', message: 'Invalid input' }, { status: 400, headers });
    }

    const { fullName, email, phone, message } = parsed.data;

    await prisma.contactMessage.create({
      data: { fullName, email, phone, message },
    });

    return NextResponse.json({ status: 'success', message: 'Message sent successfully' }, { headers });
  } catch (err) {
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500, headers });
  }
}
