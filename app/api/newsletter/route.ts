import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterSchema } from '@/validators/schema';
import { handleCors } from '@/lib/cors';

// GET handler
export async function GET(req: NextRequest) {
  const corsHeaders = handleCors(req);
  if (corsHeaders instanceof NextResponse) return corsHeaders;

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: {
        subscribedAt: 'desc',
      },
    });

    return NextResponse.json(subscribers, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch subscribers' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST handler
export async function POST(req: NextRequest) {
  const corsHeaders = handleCors(req);
  if (corsHeaders instanceof NextResponse) return corsHeaders;

  try {
    const data = await req.json();
    const parsed = newsletterSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ status: 'error', message: 'Invalid email' }, { status: 400, headers: corsHeaders });
    }

    const { email } = parsed.data;

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json(
      { status: 'success', message: 'You have been subscribed to the newsletter' },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error('Error in POST /newsletter:', err);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}
