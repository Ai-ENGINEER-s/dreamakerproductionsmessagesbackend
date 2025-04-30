import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterSchema } from '@/validators/schema';
import { getCorsHeaders } from '@/lib/cors';

// OPTIONS: gestion du préflight
export function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  const headers = getCorsHeaders(origin);
  return new NextResponse(null, { status: 200, headers });
}

// GET: récupérer les abonnés
export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  const headers = getCorsHeaders(origin);

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: {
        subscribedAt: 'desc',
      },
    });

    return NextResponse.json(subscribers, { headers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch subscribers' },
      { status: 500, headers }
    );
  }
}

// POST: inscription à la newsletter
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const headers = getCorsHeaders(origin);

  try {
    const data = await req.json();
    const parsed = newsletterSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid email' },
        { status: 400, headers }
      );
    }

    const { email } = parsed.data;

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json(
      { status: 'success', message: 'You have been subscribed to the newsletter' },
      { headers }
    );
  } catch (err) {
    console.error('Error in POST /newsletter:', err);
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' },
      { status: 500, headers }
    );
  }
}
