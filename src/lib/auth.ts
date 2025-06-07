import { prisma } from './db';

// Custom session validation for Next.js 15 and AuthKit session cookie
export async function getOrCreateUserFromWorkOS(workosUser: any) {
  let user = await prisma.user.findUnique({ where: { workosUserId: workosUser.id } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        workosUserId: workosUser.id,
        email: workosUser.email,
        name: workosUser.firstName ? `${workosUser.firstName} ${workosUser.lastName}` : null,
        // role, deactivated, credits, isSubscribed use defaults from schema
      }
    });
  }
  return user;
}

export async function getAuthenticatedUser(request: Request) {
  try {
    // Extract the session cookie (AuthKit default: 'wos-session')
    const sessionCookie = request.headers.get('cookie')?.split(';')
      .find(c => c.trim().startsWith('wos-session='))
      ?.split('=')[1];
    if (!sessionCookie) return null;

    // Validate session via WorkOS REST API
    const sessionRes = await fetch(`https://api.workos.com/user_management/sessions/${sessionCookie}`, {
      headers: {
        'Authorization': `Bearer ${process.env.WORKOS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    if (!sessionRes.ok) return null;
    const session = await sessionRes.json();
    if (!session || !session.user_id) return null;

    // Fetch user via WorkOS REST API
    const userRes = await fetch(`https://api.workos.com/user_management/users/${session.user_id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.WORKOS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    if (!userRes.ok) return null;
    const workosUser = await userRes.json();
    if (!workosUser) return null;

    return await getOrCreateUserFromWorkOS(workosUser);
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export function getSignInUrl() {
  // Use the AuthKit sign-in endpoint
  return '/api/auth/signin';
}

export function getSignOutUrl() {
  // Use the AuthKit sign-out endpoint
  return '/api/auth/signout';
}