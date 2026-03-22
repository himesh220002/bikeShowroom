import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
    // 1. Basic Request Logging (For "No Errors Walk Under Our Vision" promise)
    const startTime = Date.now();
    const response = NextResponse.next();
    const duration = Date.now() - startTime;

    console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname} - ${duration}ms`);

    // 2. Future: Auth protection for /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Add auth check here
    }

    return response;
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
};
