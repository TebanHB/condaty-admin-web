// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // Para borrar una cookie, la establecemos con una fecha de expiración en el pasado.
  const serializedCookie = serialize('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1, // La cookie expira inmediatamente
    path: '/',
  });

  const response = NextResponse.json({ message: 'Sesión cerrada exitosamente' });
  
  response.headers.set('Set-Cookie', serializedCookie);
  
  return response;
}