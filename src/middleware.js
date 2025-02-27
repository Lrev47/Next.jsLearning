import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Middleware function to protect routes and handle authentication
export async function middleware(request) {
  const pathname = request.nextUrl.pathname
  
  // Check if the path is protected (admin routes)
  const isAdminRoute = pathname.startsWith('/admin')
  const isApiAdminRoute = pathname.startsWith('/api/admin')
  
  // Token will be available if the user is authenticated
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'your-fallback-secret-should-be-changed-in-production',
  })
  
  // Redirects for authentication
  if ((isAdminRoute || isApiAdminRoute) && (!token || token.role !== 'ADMIN')) {
    // Non-admin users trying to access admin routes - send to 403 or home
    if (token) {
      // Authenticated but not admin - 403 Forbidden
      return NextResponse.redirect(new URL('/403', request.url))
    } else {
      // Not authenticated - redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

// Only run middleware on matching routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/dashboard/:path*',
  ],
} 