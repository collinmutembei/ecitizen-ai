import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware();

// Match against the pages
export const config = { matcher: ['/((?!api/auth/callback|api/auth/signin|login|_next|favicon.ico|public|api/payments/callback).*)'] };
