import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isProduction } from './lib/env'

// This middleware runs on every request
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Only apply to /api routes
  if (path.startsWith('/api/')) {
    // Clone the request headers
    const requestHeaders = new Headers(request.headers)

    // Create a response object
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    // Add CORS headers for API routes
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set(
      'Access-Control-Allow-Origin',
      isProduction() ? process.env.NEXT_PUBLIC_APP_URL || '' : '*',
    )
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    )

    return response
  }

  return NextResponse.next()
}

// Configure the middleware to run only on API routes
export const config = {
  matcher: '/api/:path*',
}
