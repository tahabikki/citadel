import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { buildAuthCookieOptions, getCurrentUser, loginUser, registerUser } from '@/lib/services/authApiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, firstName, lastName, phone } = body;

    if (action === 'register') {
      if (!email || !password || !firstName || !lastName) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const session = await registerUser({ email, password, firstName, lastName, phone });

      const response = NextResponse.json({
        user: session.user,
        token: session.token
      });

      response.cookies.set('auth-token', session.token, buildAuthCookieOptions());

      return response;
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password required' },
          { status: 400 }
        );
      }

      const session = await loginUser({ email, password });

      const response = NextResponse.json({
        user: session.user,
        token: session.token
      });

      response.cookies.set('auth-token', session.token, buildAuthCookieOptions());

      return response;
    }

    if (action === 'logout') {
      const response = NextResponse.json({ success: true });
      response.cookies.delete('auth-token');
      return response;
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await getCurrentUser(session);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}