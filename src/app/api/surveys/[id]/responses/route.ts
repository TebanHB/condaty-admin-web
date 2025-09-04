// src/app/api/surveys/[id]/responses/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { SurveyResponse } from '@/types/survey';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '@/types/jwt';

const responsesFilePath = path.join(process.cwd(), 'src/lib/fakeData/responses.json');

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // --- Obtenemos el 'id' usando await ---
        const { id } = await context.params;

        // El resto de la lógica de autenticación y manejo de datos sigue igual
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error('JWT_SECRET no está configurado');

        let decodedToken: JwtPayload;
        try {
            decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch (error) {
            console.error("Invalid token error:", error);
            return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
        }

        const body = await request.json();
        const { answers } = body;

        if (!answers || !Array.isArray(answers)) {
            return NextResponse.json({ message: 'Las respuestas son requeridas' }, { status: 400 });
        }

        const responsesFile = await fs.readFile(responsesFilePath, 'utf8');
        const allResponses: SurveyResponse[] = JSON.parse(responsesFile);

        const newResponse: SurveyResponse = {
            responseId: `resp-${Date.now()}`,
            surveyId: id,
            userEmail: decodedToken.email,
            submittedAt: new Date().toISOString(),
            answers: answers,
        };

        allResponses.push(newResponse);
        await fs.writeFile(responsesFilePath, JSON.stringify(allResponses, null, 4));

        return NextResponse.json(newResponse, { status: 201 });

    } catch (error) {
        console.error('Error al guardar la respuesta:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}