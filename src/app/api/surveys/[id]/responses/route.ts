// src/app/api/surveys/[id]/responses/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { SurveyResponse } from '@/types/survey';
import jwt from 'jsonwebtoken';

// Rutas a nuestros archivos de datos falsos
const responsesFilePath = path.join(process.cwd(), 'src/lib/fakeData/responses.json');

// La función POST se encarga de recibir y guardar nuevos datos
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // --- 1. Verificar la autenticación del usuario ---
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error('JWT_SECRET no está configurado');

        let decodedToken: any;
        try {
            decodedToken = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
        }

        // --- 2. Leer los datos enviados desde la app móvil ---
        const body = await request.json();
        const { answers } = body;

        if (!answers || !Array.isArray(answers)) {
            return NextResponse.json({ message: 'Las respuestas son requeridas' }, { status: 400 });
        }

        // --- 3. Leer las respuestas existentes ---
        const responsesFile = await fs.readFile(responsesFilePath, 'utf8');
        const allResponses: SurveyResponse[] = JSON.parse(responsesFile);

        // --- 4. Crear el nuevo objeto de respuesta ---
        const newResponse: SurveyResponse = {
            responseId: `resp-${Date.now()}`, // Generamos un ID único simple
            surveyId: params.id, // El ID de la encuesta viene de la URL
            userEmail: decodedToken.email, // El email del usuario viene del token
            submittedAt: new Date().toISOString(), // La fecha y hora actual
            answers: answers, // Las respuestas del body
        };

        // --- 5. Añadir la nueva respuesta y guardar el archivo ---
        allResponses.push(newResponse);
        await fs.writeFile(responsesFilePath, JSON.stringify(allResponses, null, 4));

        // --- 6. Devolver la respuesta creada con éxito ---
        return NextResponse.json(newResponse, { status: 201 }); // 201 = Created

    } catch (error) {
        console.error('Error al guardar la respuesta:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}