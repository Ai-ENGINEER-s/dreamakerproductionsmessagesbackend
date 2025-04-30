import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/brevo';
import { contactSchema } from '@/validators/schema';

// Nouvelle fonction GET pour récupérer les contacts
export async function GET() {
  try {
    const contacts = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// La fonction POST existante pour créer des contacts
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = contactSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ status: 'error', message: 'Invalid input' }, { status: 400 });
    }

    const { fullName, email, phone, message } = parsed.data;

    await prisma.contactMessage.create({
      data: { fullName, email, phone, message },
    });

    // await sendEmail({
    //   to: 'barrysanoussa19@gmail.com',
    //   subject: 'Nouveau message de contact',
    //   html: `<p><strong>Nom:</strong> ${fullName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Téléphone:</strong> ${phone || 'N/A'}</p><p><strong>Message:</strong><br>${message}</p>`
    // });

    return NextResponse.json({ status: 'success', message: 'Message sent successfully' });
  } catch (err) {
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}