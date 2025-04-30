import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: {
        subscribedAt: 'desc'
      }
    });
    

    interface Subscriber {
  id: number;
  email: string;
  subscribedAt: Date;
}
    // Créer le contenu CSV
    let csvContent = 'id,email,subscribedAt\n';
    
subscribers.forEach((subscriber: Subscriber) => {
  const subscribedAtFormatted = subscriber.subscribedAt.toISOString();
  csvContent += `${subscriber.id},"${subscriber.email}","${subscribedAtFormatted}"\n`;
});

    // Créer la réponse avec les bons headers
    const response = new NextResponse(csvContent);
    
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set('Content-Disposition', 'attachment; filename=newsletter-subscribers.csv');
    
    return response;
  } catch (error) {
    console.error('Error exporting subscribers:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to export subscribers' },
      { status: 500 }
    );
  }
}