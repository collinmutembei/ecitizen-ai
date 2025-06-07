import { mpesaService } from '@/lib/mpesa'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(req: Request) {
  const user = await getAuthenticatedUser(req)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }
  const { amount, phoneNumber, credits } = await req.json()
  if (!amount || !phoneNumber || !credits) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
  try {
    const checkoutId = await mpesaService.initiateSTKPush(phoneNumber, amount, user.id, credits)
    return new Response(JSON.stringify({ checkoutId }), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
