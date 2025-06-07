import { getAuthenticatedUser } from '@/lib/auth'
import { mcpServer } from '@/lib/mcp-server'
import type { User } from '@/lib/types'

export async function POST(req: Request) {
  // Use the native Request type for compatibility
  const authUser = await getAuthenticatedUser(req)
  if (!authUser) {
    return new Response(JSON.stringify({ error: { code: 401, message: 'Unauthorized' } }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  // Cast to only the needed User fields
  const user: User = {
    id: authUser.id,
    email: authUser.email,
    name: authUser.name ?? undefined,
    credits: authUser.credits,
    isSubscribed: authUser.isSubscribed,
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: { code: 400, message: 'Invalid JSON' } }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

  const response = await mcpServer.handleRequest(body, user)
  if (response.error) {
    return new Response(JSON.stringify(response), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
  return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } })
}
