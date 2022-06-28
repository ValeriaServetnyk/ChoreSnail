import cookie from 'cookie';

// cookie to store user token session
export function createSerializedRegisterSessionTokenCookie(token: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  // lifecycle of the cookie. For this case is 24 hours
  const maxAge = 60 * 60 * 24;

  // lifetime of the cookie and additional security checks
  return cookie.serialize('sessionToken', token, {
    maxAge: maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: true,
    secure: isProduction,
    path: '/',
    sameSite: 'lax',
  });
}
