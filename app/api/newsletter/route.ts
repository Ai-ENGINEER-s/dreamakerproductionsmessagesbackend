import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/brevo';
import { newsletterSchema } from '@/validators/schema';

// Fonction GET pour récupérer les abonnés
export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: {
        subscribedAt: 'desc'
      }
    });

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

// Fonction POST pour l'inscription à la newsletter
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = newsletterSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ status: 'error', message: 'Invalid email' }, { status: 400 });
    }

    const { email } = parsed.data;

    // Création de l'abonné dans la base de données
    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    // Envoi de l'email de confirmation
    await sendEmail({
      to: email,
      subject: "Confirmation d'abonnement",
      html: `<p>Merci de vous être abonné à notre newsletter !</p>`
    });

    return NextResponse.json({ status: 'success', message: 'You have been subscribed to the newsletter' });
  } catch (err) {
    console.error('Error in POST /newsletter:', err);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
