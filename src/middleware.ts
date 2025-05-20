import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const isAdmin = token?.acctype === 'admin';

  const { pathname } = request.nextUrl;

  // Защищенные маршруты
  const authRoutes = ['/auth/signin', '/auth/register'];
  const protectedRoutes = ['/profile', '/profile/new-listing'];
  const adminRoutes = ['/admin'];

  // Редирект для неавторизованных пользователей
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // Редирект для авторизованных пользователей, пытающихся открыть страницы входа/регистрации
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Редирект для неадминистраторов, пытающихся открыть админские маршруты
  if (!isAdmin && adminRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Маршруты, к которым применяется middleware
export const config = {
  matcher: [
    /*
     * Сопоставляются все пути, кроме:
     * - API маршрутов (/api/*)
     * - Статических файлов (/_next/static/*, /favicon.ico, и т.д.)
     */
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};
