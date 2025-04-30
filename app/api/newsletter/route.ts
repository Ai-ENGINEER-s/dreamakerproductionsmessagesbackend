// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterSchema } from '@/validators/schema';
import { getCorsHeaders } from '@/lib/cors';

// OPTIONS: gestion du préflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 200, headers: getCorsHeaders(origin) });
}

// GET: récupérer les abonnés
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
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
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);
  try {
    const data = await request.json();
    const parsed = newsletterSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid email' },
        { status: 400, headers }
      );
    }
    
    const { email } = parsed.data;
    
    // Vérifier si l'email est déjà inscrit
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });
    
    if (existingSubscriber) {
      return NextResponse.json(
        { status: 'info', message: 'This email is already subscribed to our newsletter' },
        { headers }
      );
    }
    
    // Inscrire le nouvel email uniquement s'il n'existe pas déjà
    await prisma.newsletterSubscriber.create({
      data: { email },
    });
    
    return NextResponse.json(
      { status: 'success', message: 'You have been successfully subscribed to our newsletter' },
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