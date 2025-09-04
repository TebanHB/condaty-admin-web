import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
    let tokenValue: string | undefined;

    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        tokenValue = authHeader.split(' ')[1];
    }

    if (!tokenValue) {
        // <<-- CAMBIO AQUÍ
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get('authToken');
        tokenValue = tokenCookie?.value;
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('La variable de entorno JWT_SECRET no está definida');
    }

    if (!tokenValue) {
        return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(tokenValue, JWT_SECRET);
        return NextResponse.json(decoded, { status: 200 });
    } catch (error) {
        console.error('JWT verification error:', error);
        return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }
}