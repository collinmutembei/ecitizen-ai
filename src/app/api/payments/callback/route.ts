import { mpesaService } from '@/lib/mpesa'

export async function POST(req: Request) {
  const callbackData = await req.json()
  try {
    await mpesaService.handleCallback(callbackData)
    return new Response(JSON.stringify({ status: 'ok' }), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
