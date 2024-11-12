import { NextResponse, NextRequest } from 'next/server'

import { getToken } from 'next-auth/jwt'

export {default} from 'next-auth/middleware'

 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request, raw: true});

    const url = request.nextUrl;

    console.log('this is token', token);

    if(token && (url.pathname.startsWith('/auth'))){
      return NextResponse.redirect(new URL('/app', request.url))
    }

    if(!token && url.pathname.startsWith('/app')){
        return NextResponse.redirect(new URL('/auth', request.url))
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/auth',
    '/app/:path*'
  ],
}