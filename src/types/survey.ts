// Este tipo define los posibles estados de una encuesta.
export type SurveyStatus = 'draft' | 'active' | 'closed';

// Esta interfaz define la estructura completa de una encuesta.
export interface Survey {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  targetAudience: string[];
  createdAt: string;
  questions: {
    id: string;
    text: string;
    type: string;
    options: string[];
  }[];
  responseCount?: number;
}

export interface SurveyResponse {
  responseId: string;
  surveyId: string;
  userEmail: string;
  submittedAt: string;
  answers: {
    questionId: string;
    value: string | string[];
  }[];
}

// Define la estructura de los datos que esperamos de la API de resultados.
export interface SurveyResults {
  survey: Survey;
  responses: SurveyResponse[];
}