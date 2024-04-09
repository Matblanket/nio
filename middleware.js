import { NextResponse } from 'next/server';

// Define the middleware function
export function middleware(request) {
  // Check if the request path matches '/profile'
  if (request.nextUrl.pathname === '/profile') {
    // Redirect to the '/login' path
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Continue to the next middleware if the path doesn't match
}

// Export the middleware configuration
export const config = {
  // Specify the path matcher
  // This middleware will be applied to all paths
  // Adjust the path matcher if you only want it to apply to specific paths
  matcher: "/profile"
};

