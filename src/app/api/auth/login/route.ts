import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import users from '@/lib/fakeData/users.json';

// Expiración del token y la cookie (30 días en segundos)
const TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24 * 30;

// Un "secreto" para firmar el JWT. En una app real, esto estaría en variables de entorno.
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-secreto';

// Simulación de nuestra base de datos de usuarios


export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // 1. Buscar al usuario
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }

  // 2. Si el usuario es válido, crear el JWT
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_SECONDS, // Expira en 30 días
      email: user.email,
      role: user.role,
    },
    JWT_SECRET
  );

  // 3. Serializar el token en una cookie segura
  const serializedCookie = serialize('authToken', token, {
    httpOnly: true, // El navegador no permite que JS acceda a la cookie
    secure: process.env.NODE_ENV === 'production', // Solo enviar en HTTPS en producción
    sameSite: 'strict', // 'strict' o 'lax' para protección CSRF
    maxAge: TOKEN_EXPIRATION_SECONDS, // Coincide con la expiración del token
    path: '/',
  });

  // 4. Devolver la respuesta exitosa y establecer la cookie en el navegador
  const response = NextResponse.json(
    { role: user.role, email: user.email },
    { status: 200 }
  );
  
  response.headers.set('Set-Cookie', serializedCookie);
  
  return response;
}