// lib/cors.ts
export function getCorsHeaders(origin: string | null): HeadersInit {
  // Permettre spécifiquement le domaine de votre frontend ou utiliser '*' pour tout domaine
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 heures de cache pour les réponses preflight
    'Access-Control-Allow-Credentials': 'true',
  };
}