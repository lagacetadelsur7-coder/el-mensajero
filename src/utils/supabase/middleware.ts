import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const sessionEmail = request.cookies.get('editor_session')?.value;
  
  if (request.nextUrl.pathname.startsWith('/revision') && request.nextUrl.pathname !== '/revision/login') {
    if (!sessionEmail) {
      const url = request.nextUrl.clone()
      url.pathname = '/revision/login'
      return NextResponse.redirect(url)
    }

    const allowedEmails = ['cesar@elmensajero.com', 'laura@elmensajero.com'];
    const normalizedEmail = sessionEmail.toLowerCase();
    if (!allowedEmails.includes(normalizedEmail)) {
      const url = request.nextUrl.clone();
      url.pathname = '/revision/login';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next()
}
