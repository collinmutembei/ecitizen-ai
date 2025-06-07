import { getAuthenticatedUser } from '@/lib/auth'
import { mcpServer } from '@/lib/mcp-server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  // Authenticate
  const sessionUser = await getAuthenticatedUser(req)
  if (!sessionUser) {
    return new Response(JSON.stringify({ error: { code: 401, message: 'Unauthorized' } }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  // Fetch full user from DB
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
  })
  if (!user) {
    return new Response(JSON.stringify({ error: { code: 401, message: 'User not found' } }), { status: 401, headers: { 'Content-Type': 'application/json' } })
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
