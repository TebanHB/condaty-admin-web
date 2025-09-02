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