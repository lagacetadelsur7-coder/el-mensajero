import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    const secret = process.env.NEXT_PUBLIC_ADMIN_CODE;
    if (!secret) {
      return NextResponse.json({ error: 'Admin code not configured' }, { status: 500 });
    }
    if (code === secret) {
      return NextResponse.json({ authorized: true }, { status: 200 });
    }
    return NextResponse.json({ authorized: false }, { status: 401 });
  } catch (err) {
    console.error(err);
    return new Response('Error', { status: 500 });
  }
}
