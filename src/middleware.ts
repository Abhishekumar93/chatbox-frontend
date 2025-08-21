import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTE_URLS } from './constants/routeUrls';

const { LOGIN, REGISTER, MESSAGES } = ROUTE_URLS;

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  console.log(token, 'token from middleware');

  const publicRoutes = [LOGIN, REGISTER];

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL(MESSAGES, request.url));
  } else {
    request.headers.set('Authorization', `Bearer ${token}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
