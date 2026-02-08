import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';
import { routing } from '@/i18n/routing';
import {
  getTenantFromDomain,
  TENANT_COOKIE_NAME,
  TENANT_HEADER_NAME,
} from '@/lib/domain-mapping';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || 'localhost';

  // Get tenant from domain mapping
  const tenantMapping = getTenantFromDomain(hostname);

  // Handle internationalization first
  const intlResponse = intlMiddleware(request);

  // Update Supabase session
  const sessionResponse = await updateSession(request);

  // If the session middleware returns a redirect, use that
  if (sessionResponse.headers.has('location')) {
    // Still set tenant cookie on redirects
    if (tenantMapping) {
      sessionResponse.cookies.set(TENANT_COOKIE_NAME, tenantMapping.tenantId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    return sessionResponse;
  }

  // Copy session cookies to the intl response
  const setCookieHeader = sessionResponse.headers.get('set-cookie');
  if (setCookieHeader) {
    intlResponse.headers.set('set-cookie', setCookieHeader);
  }

  // Set tenant cookie in the response
  if (tenantMapping) {
    // Add tenant cookie
    const existingCookies = intlResponse.headers.get('set-cookie') || '';
    const tenantCookie = `${TENANT_COOKIE_NAME}=${tenantMapping.tenantId}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;

    if (existingCookies) {
      intlResponse.headers.set('set-cookie', `${existingCookies}, ${tenantCookie}`);
    } else {
      intlResponse.headers.set('set-cookie', tenantCookie);
    }

    // Set tenant header for downstream use
    intlResponse.headers.set(TENANT_HEADER_NAME, tenantMapping.tenantId);
  }

  return intlResponse;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api routes
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - Static files (svg, png, jpg, etc.)
    '/((?!api|_next|_vercel|.*\\..*|favicon.ico).*)',
    // Also match root
    '/',
  ],
};
