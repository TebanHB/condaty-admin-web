import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Survey } from '@/types/survey';

const surveysFilePath = path.join(process.cwd(), 'src/lib/fakeData/surveys.json');

// --- GET (obtener una encuesta por ID) ---
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const fileContents = await fs.readFile(surveysFilePath, 'utf8');
        const surveys: Survey[] = JSON.parse(fileContents);
        const survey = surveys.find(s => s.id === params.id);

        if (!survey) {
            return NextResponse.json({ message: 'Encuesta no encontrada' }, { status: 404 });
        }
        return NextResponse.json(survey);
    } catch (error) {
        console.error('Error al leer las encuestas:', error);
        return NextResponse.json({ message: 'Error al leer las encuestas' }, { status: 500 });
    }
}

// --- PUT (actualizar una encuesta) ---
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const updatedSurveyData: Partial<Survey> = await request.json();
        const fileContents = await fs.readFile(surveysFilePath, 'utf8');
        let surveys: Survey[] = JSON.parse(fileContents);

        const surveyIndex = surveys.findIndex(s => s.id === params.id);
        if (surveyIndex === -1) {
            return NextResponse.json({ message: 'Encuesta no encontrada' }, { status: 404 });
        }

        // Actualizamos la encuesta con los nuevos datos
        surveys[surveyIndex] = { ...surveys[surveyIndex], ...updatedSurveyData };

        await fs.writeFile(surveysFilePath, JSON.stringify(surveys, null, 2));

        return NextResponse.json(surveys[surveyIndex]);
    } catch (error) {
        console.error('Error al actualizar la encuesta:', error);
        return NextResponse.json({ message: 'Error al actualizar la encuesta' }, { status: 500 });
    }
}