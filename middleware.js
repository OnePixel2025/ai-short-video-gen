import { NextResponse } from 'next/server';
import { auth } from './configs/firebaseConfig';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Add public paths that don't require authentication
  const publicPaths = ['/auth/login', '/auth/signup', '/', '/api'];
  
  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const token = request.cookies.get('auth-token');
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create-new-video/:path*',
    '/billing/:path*',
    '/explore/:path*',
    '/play-video/:path*',
  ],
};