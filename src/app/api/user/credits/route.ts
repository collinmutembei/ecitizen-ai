import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(req: Request) {
  const user = await getAuthenticatedUser(req)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }
  return new Response(JSON.stringify({ credits: user.credits, isSubscribed: user.isSubscribed }), { headers: { 'Content-Type': 'application/json' } })
}
