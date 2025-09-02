import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Survey } from '@/types/survey';

// Construimos la ruta al archivo JSON
const surveysFilePath = path.join(process.cwd(), 'src/lib/fakeData/surveys.json');
const responsesFilePath = path.join(process.cwd(), 'src/lib/fakeData/responses.json');

// --- Función GET: Obtener todas las encuestas ---
export async function GET() {
    try {
        // 1. Leemos ambos archivos en paralelo para más eficiencia
        const [surveysFile, responsesFile] = await Promise.all([
            fs.readFile(surveysFilePath, 'utf8'),
            fs.readFile(responsesFilePath, 'utf8')
        ]);

        const surveys: Survey[] = JSON.parse(surveysFile);
        const responses: { surveyId: string }[] = JSON.parse(responsesFile);

        // 2. Creamos un mapa para contar las respuestas de cada encuesta
        const responseCounts = responses.reduce((acc, response) => {
            acc[response.surveyId] = (acc[response.surveyId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // 3. Añadimos el conteo a cada encuesta
        const surveysWithCounts = surveys.map(survey => ({
            ...survey,
            responseCount: responseCounts[survey.id] || 0
        }));

        return NextResponse.json(surveysWithCounts);

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