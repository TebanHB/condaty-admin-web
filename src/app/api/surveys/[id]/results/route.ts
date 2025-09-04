// src/app/api/surveys/[id]/results/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Survey, SurveyResponse } from '@/types/survey';

const surveysFilePath = path.join(process.cwd(), 'src/lib/fakeData/surveys.json');
const responsesFilePath = path.join(process.cwd(), 'src/lib/fakeData/responses.json');

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // --- Obtenemos el 'id' usando await ---
        const { id } = await context.params;

        const [surveysFile, responsesFile] = await Promise.all([
            fs.readFile(surveysFilePath, 'utf8'),
            fs.readFile(responsesFilePath, 'utf8')
        ]);

        const surveys: Survey[] = JSON.parse(surveysFile);
        const allResponses: SurveyResponse[] = JSON.parse(responsesFile);

        const survey = surveys.find(s => s.id === id);
        if (!survey) {
            return NextResponse.json({ message: 'Encuesta no encontrada' }, { status: 404 });
        }

        const surveyResponses = allResponses.filter(r => r.surveyId === id);

        return NextResponse.json({
            survey,
            responses: surveyResponses,
        });
    } catch (error) {
        console.error('Error al obtener los resultados de la encuesta:', error);
        return NextResponse.json({ message: 'Error al obtener los resultados' }, { status: 500 });
    }
}