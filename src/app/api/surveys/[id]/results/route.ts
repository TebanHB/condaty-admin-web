import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Survey, SurveyResponse } from '@/types/survey';
import {  } from '@/services/surveyApi';

const surveysFilePath = path.join(process.cwd(), 'src/lib/fakeData/surveys.json');
const responsesFilePath = path.join(process.cwd(), 'src/lib/fakeData/responses.json');

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const [surveysFile, responsesFile] = await Promise.all([
            fs.readFile(surveysFilePath, 'utf8'),
            fs.readFile(responsesFilePath, 'utf8')
        ]);

        const surveys: Survey[] = JSON.parse(surveysFile);
        const allResponses: SurveyResponse[] = JSON.parse(responsesFile);

        const survey = surveys.find(s => s.id === params.id);
        if (!survey) {
            return NextResponse.json({ message: 'Encuesta no encontrada' }, { status: 404 });
        }

        const surveyResponses = allResponses.filter(r => r.surveyId === params.id);

        return NextResponse.json({
            survey,
            responses: surveyResponses,
        });
    } catch (error) {
        console.error('Error al obtener los resultados de la encuesta:', error);
        return NextResponse.json({ message: 'Error al obtener los resultados' }, { status: 500 });
    }
}