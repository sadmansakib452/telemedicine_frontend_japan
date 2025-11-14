/**
 * Next.js Middleware
 * 
 * Handles route protection, authentication, and role-based access control.
 * Runs on the edge runtime before requests are processed.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RouteHelpers, PUBLIC_ROUTES, PROTECTED_ROUTES } from '@/config/routes';

/**
 * Get token from request
 * Checks both cookies and Authorization header
 * 
 * @param request NextRequest object
 * @returns Token string or null
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // Check cookies first (for page navigation - most common case)
  // Access token is stored in cookie by setAccessToken in token.ts
  const cookieToken = request.cookies.get('access_token')?.value;
  if (cookieToken) {
    return cookieToken;
  }
  
  // Check Authorization header (for API requests)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

/**
 * JWT Token Payload (decoded, unverified)
 */
interface JwtPayload {
  exp?: number;
  type?: string;
  userType?: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * Decode JWT token (without verification)
 * Only checks if token exists and has basic structure
 * Uses atob which is available in Edge runtime
 * 
 * @param token JWT token
 * @returns Decoded payload or null
 */
function decodeTokenUnsafe(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    // Decode payload (without verification)
    // Use atob for base64 decoding (available in Edge runtime)
    const payload = parts[1];
    // Replace URL-safe base64 characters
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // Pad base64 string if needed
    const paddedBase64 = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const decoded = atob(paddedBase64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 * 
 * @param token JWT token
 * @returns True if expired, false otherwise
 */
function isTokenExpired(token: string): boolean {
  const decoded = decodeTokenUnsafe(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  
  return currentTime >= expiryTime;
}

/**
 * Get user type from token
 * 
 * @param token JWT token
 * @returns User type or null
 */
function getUserTypeFromToken(token: string): string | null {
  const decoded = decodeTokenUnsafe(token);
  if (!decoded) {
    return null;
  }
  
  // Token may contain user type in different fields
  return decoded.type || decoded.userType || decoded.role || null;
}

/**
 * Middleware function
 * Handles route protection and authentication
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getTokenFromRequest(request);
  
  // Check if route is public
  const isPublicRoute = RouteHelpers.isPublicRoute(pathname) || 
                        pathname === '/' || 
                        pathname.startsWith('/api') ||
                        pathname.startsWith('/_next') ||
                        pathname.startsWith('/images') ||
                        pathname.includes('favicon');
  
  // Check if route is protected
  const isProtectedRoute = RouteHelpers.isProtectedRoute(pathname);
  
  // Check if route requires admin role
  const isAdminRoute = RouteHelpers.isAdminRoute(pathname);
  
    // Check if route requires doctor role
    const isDoctorRoute = RouteHelpers.isDoctorRoute(pathname);
    
    // Check if route requires shop owner role
    const isShopOwnerRoute = RouteHelpers.isShopOwnerRoute(pathname);
    
    // Handle public routes - allow access
  if (isPublicRoute) {
    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if ((pathname === PUBLIC_ROUTES.LOGIN || pathname === PUBLIC_ROUTES.REGISTER) && token) {
      // Check if token is valid (not expired)
      if (!isTokenExpired(token)) {
        const userType = getUserTypeFromToken(token);
        if (userType) {
          const redirectRoute = RouteHelpers.getRedirectRoute(userType);
          return NextResponse.redirect(new URL(redirectRoute, request.url));
        }
      }
    }
    
    // Allow access to public routes
    return NextResponse.next();
  }
  
  // Handle protected routes - require authentication
  if (isProtectedRoute) {
    // Check if token exists
    if (!token) {
      // No token - redirect to login
      const loginUrl = new URL(PUBLIC_ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      // Token expired - redirect to login
      const loginUrl = new URL(PUBLIC_ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('expired', 'true');
      return NextResponse.redirect(loginUrl);
    }
    
    // Get user type from token
    const userType = getUserTypeFromToken(token);
    
    // Check admin routes
    if (isAdminRoute) {
      if (userType !== 'admin') {
        // Not admin - redirect to appropriate route
        const redirectRoute = userType 
          ? RouteHelpers.getRedirectRoute(userType)
          : PROTECTED_ROUTES.CONVERSATIONS;
        return NextResponse.redirect(new URL(redirectRoute, request.url));
      }
    }
    
    // Check doctor routes
    // Note: We don't strictly enforce type check here because:
    // 1. JWT token might not have type field (depends on backend implementation)
    // 2. Component will handle role check after fetching user data from /auth/me
    // 3. This prevents premature redirects before user data is loaded
    // The component (BroadcastsInboxWorkspace) will redirect if user is not a doctor
    if (isDoctorRoute) {
      // Only redirect if we can definitively determine user is NOT a doctor
      // If userType is null/undefined, allow the request and let component handle it
      if (userType && userType !== 'doctor') {
        // Not doctor - redirect to conversations
        return NextResponse.redirect(new URL(PROTECTED_ROUTES.CONVERSATIONS, request.url));
      }
      // If userType is null or 'doctor', allow the request
      // Component will verify using /auth/me endpoint
    }
    
    // Check shop owner routes
    // Note: Similar to doctor routes, we don't strictly enforce type check here
    // Component will handle role check after fetching user data from /auth/me
    if (isShopOwnerRoute) {
      // Only redirect if we can definitively determine user is NOT a shop owner
      // If userType is null/undefined, allow the request and let component handle it
      const isShopOwner = userType === 'shop_keeper' || userType === 'shop_owner';
      if (userType && !isShopOwner) {
        // Not shop owner - redirect to conversations
        return NextResponse.redirect(new URL(PROTECTED_ROUTES.CONVERSATIONS, request.url));
      }
      // If userType is null or shop owner, allow the request
      // Component will verify using /auth/me endpoint
    }
    
    // Token is valid and user has access - allow request
    return NextResponse.next();
  }
  
  // Default: allow request
  return NextResponse.next();
}

/**
 * Middleware configuration
 * Specifies which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};

