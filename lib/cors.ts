// lib/cors.ts
import { NextRequest, NextResponse } from 'next/server';

export function handleCors(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';

  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  // Pour les requêtes prévol (préflight)
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers,
    });
  }

  return headers;
}
