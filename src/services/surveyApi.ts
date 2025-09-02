// src/services/surveyApi.ts
import { Survey, SurveyResults } from "@/types/survey";

const API_BASE_URL = '/api/surveys';

export const getSurveys = async (signal?: AbortSignal): Promise<Survey[]> => {
    const response = await fetch(API_BASE_URL, { signal });
    if (!response.ok) {
        throw new Error('Error al obtener las encuestas');
    }
    return response.json();
};

export const createSurvey = async (survey: Survey): Promise<Survey> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(survey),
    });
    if (!response.ok) {
        throw new Error('Error al crear la encuesta');
    }
    return response.json();
};

export const getSurveyById = async (id: string, signal?: AbortSignal): Promise<Survey> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, { signal });
    if (!response.ok) {
        throw new Error('Error al obtener la encuesta');
    }
    return response.json();
};

export const updateSurvey = async (id: string, surveyData: Partial<Survey>): Promise<Survey> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
    });
    if (!response.ok) {
        throw new Error('Error al actualizar la encuesta');
    }
    return response.json();
};

export const getSurveyResults = async (id: string, signal?: AbortSignal): Promise<SurveyResults> => {
    const response = await fetch(`${API_BASE_URL}/${id}/results`, { signal });
    if (!response.ok) {
        throw new Error('Error al obtener los resultados de la encuesta');
    }
    return response.json();
};