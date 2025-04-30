import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/brevo';
import { contactSchema } from '@/validators/schema';
import { handleCors } from '@/lib/cors';

// GET: récupérer les contacts
export async function GET(req: NextRequest) {
  const corsHeaders = handleCors(req);
  if (corsHeaders instanceof NextResponse) return corsHeaders;

  try {
    const contacts = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(contacts, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch contacts' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST: créer un contact
export async function POST(req: NextRequest) {
  const corsHeaders = handleCors(req);
  if (corsHeaders instanceof NextResponse) return corsHeaders;

  try {
    const data = await req.json();
    const parsed = contactSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ status: 'error', message: 'Invalid input' }, { status: 400, headers: corsHeaders });
    }

    const { fullName, email, phone, message } = parsed.data;

    await prisma.contactMessage.create({
      data: { fullName, email, phone, message },
    });

    // await sendEmail({ ... });

    return NextResponse.json({ status: 'success', message: 'Message sent successfully' }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}
