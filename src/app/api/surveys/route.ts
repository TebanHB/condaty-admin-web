import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Survey } from '@/types/survey';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Construimos la ruta al archivo JSON
const surveysFilePath = path.join(process.cwd(), 'src/lib/fakeData/surveys.json');
const responsesFilePath = path.join(process.cwd(), 'src/lib/fakeData/responses.json');

// --- Función GET: Obtener todas las encuestas ---
export async function GET(request: NextRequest) {
    try {
        // --- Bloque de Autenticación (sin cambios) ---
        let tokenValue: string | undefined;

        const authHeader = request.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
            tokenValue = authHeader.split(' ')[1];
        }

        if (!tokenValue) {
            const tokenCookie = (await cookies()).get('authToken');
            tokenValue = tokenCookie?.value;
        }

        if (!tokenValue) {
            return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error('JWT_SECRET no está configurado');

        let decodedToken: any;
        try {
            decodedToken = jwt.verify(tokenValue, JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
        }

        const userRole = decodedToken.role;

        // --- Obtención de datos (sin cambios) ---
        const [surveysFile, responsesFile] = await Promise.all([
            fs.readFile(surveysFilePath, 'utf8'),
            fs.readFile(responsesFilePath, 'utf8')
        ]);

        const allSurveys: Survey[] = JSON.parse(surveysFile);
        const responses: { surveyId: string }[] = JSON.parse(responsesFile);

        const responseCounts = responses.reduce((acc, response) => {
            acc[response.surveyId] = (acc[response.surveyId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const surveysWithCounts = allSurveys.map(survey => ({
            ...survey,
            responseCount: responseCounts[survey.id] || 0
        }));

        // --- LÓGICA DE FILTRADO FINAL ---
        // Si el usuario es un administrador, devolvemos TODAS las encuestas.
        if (userRole === 'admin') {
            return NextResponse.json(surveysWithCounts);
        }

        // Si no es admin, aplicamos los filtros para usuarios regulares.
        const filteredForUser = surveysWithCounts.filter(survey =>
            // 1. La encuesta no debe ser un borrador.
            survey.status !== 'draft' &&
            // 2. Debe ser para todos o para el rol específico del usuario.
            (!survey.targetAudience || survey.targetAudience.length === 0 || survey.targetAudience.includes(userRole))
        );

        return NextResponse.json(filteredForUser);

    } catch (error) {
        console.error('Error al leer los datos:', error);
        return NextResponse.json({ message: 'Error al obtener las encuestas' }, { status: 500 });
    }
}

// --- Función POST: Guardar una nueva encuesta ---
export async function POST(request: Request) {
    try {
        const newSurvey: Survey = await request.json();

        // Leemos el contenido actual del archivo
        const fileContents = await fs.readFile(surveysFilePath, 'utf8');
        const surveys: Survey[] = JSON.parse(fileContents);

        // Añadimos la nueva encuesta al array
        surveys.push(newSurvey);

        // Escribimos el array actualizado de vuelta al archivo
        await fs.writeFile(surveysFilePath, JSON.stringify(surveys, null, 2));

        return NextResponse.json(newSurvey, { status: 201 }); // 201: Creado
    } catch (error) {
        console.error('Error al guardar la encuesta:', error);
        return NextResponse.json({ message: 'Error al guardar la encuesta' }, { status: 500 });
    }
}