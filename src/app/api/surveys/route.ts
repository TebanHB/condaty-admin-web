import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Survey } from '@/types/survey';

// Construimos la ruta al archivo JSON
const surveysFilePath = path.join(process.cwd(), 'src/lib/fakeData/surveys.json');

// --- Función GET: Obtener todas las encuestas ---
export async function GET() {
    try {
        const fileContents = await fs.readFile(surveysFilePath, 'utf8');
        const surveys = JSON.parse(fileContents);
        return NextResponse.json(surveys);
    } catch (error) {
        console.error('Error al leer las encuestas:', error);
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