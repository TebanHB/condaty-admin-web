// src/app/api/auth/verify/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';


export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken');
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('La variable de entorno JWT_SECRET no está definida en .env.local');
    }
    if (!token) {
        return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token.value, JWT_SECRET);
        return NextResponse.json(decoded, { status: 200 });
    } catch (error) {
        console.error('JWT verification error:', error);
        return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }
}