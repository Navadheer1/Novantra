import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes accessible without authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/sign-in',
  '/sign-up',
  '/explore',
  '/search',
  '/feed',
  '/meeting',
  '/discover',
  '/marketplace'
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow Next.js internals, API routes, and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if route is public
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Check for custom authentication token or session cookie
  const authToken =
    request.cookies.get('auth_token')?.value ||
    request.cookies.get('session_token')?.value;

  // If unauthenticated access to protected route, allow rendering so client components handle auth state without hanging
  if (!authToken) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
