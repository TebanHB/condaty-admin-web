import { Survey } from "@/types/survey";

const API_BASE_URL = '/api/surveys';

export const getSurveys = async (): Promise<Survey[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error('Error al obtener las encuestas');
    }
    return response.json();
};

export const createSurvey = async (survey: Survey): Promise<Survey> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(survey),
    });
    if (!response.ok) {
        throw new Error('Error al crear la encuesta');
    }
    return response.json();
};

// Podríamos añadir updateSurvey y deleteSurvey aquí en el futuro