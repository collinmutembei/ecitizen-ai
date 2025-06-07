import { getSignInUrl } from '@/lib/auth';

export async function GET() {
  // Return the WorkOS AuthKit sign-in URL
  const url = getSignInUrl();
  return new Response(JSON.stringify({ url }), { headers: { 'Content-Type': 'application/json' } });
}
