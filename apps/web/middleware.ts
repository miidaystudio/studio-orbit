import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected Studio Admin routes
  const adminRoutes = ['/projects', '/overview', '/clients', '/staging', '/launch-brand', '/audit', '/brand', '/invoices'];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Portal routes
  const isPortalRoute = pathname.startsWith('/portal');
  const isInviteRoute = pathname.startsWith('/portal/invite');

  if (isAdminRoute) {
    const sessionCookie = request.cookies.get('studio_session')?.value || request.cookies.get('studio_token')?.value;
    const roleCookie = request.cookies.get('studio_role')?.value;

    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based protection: CLIENT role cannot access STUDIO_ADMIN routes
    if (roleCookie === 'CLIENT') {
      const clientPortalToken = request.cookies.get('studio_portal_token')?.value || 'lumina-portal-token-9988';
      const portalUrl = new URL(`/portal/${clientPortalToken}`, request.url);
      return NextResponse.redirect(portalUrl);
    }
  }

  // Handle client portal access
  if (isPortalRoute && !isInviteRoute) {
    const sessionCookie = request.cookies.get('studio_session')?.value || request.cookies.get('studio_token')?.value;
    
    if (!sessionCookie) {
      // Allow magic token route access or redirect to invite onboarding
      const portalToken = pathname.split('/')[2];
      if (!portalToken) {
        return NextResponse.redirect(new URL('/portal/invite', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.jpg|logo\\.jpg|logo\\.png|icon\\.png|.*\\.(?:jpg|jpeg|gif|png|svg|ico)).*)',
  ],
};
