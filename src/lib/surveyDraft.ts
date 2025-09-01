import { Survey } from "@/types/survey";

// Definimos el tipo de dato que guardaremos, puede ser parcial
type SurveyDraft = Partial<Survey>;

const DRAFT_KEY = 'survey-creation-draft';

// Guarda el progreso de la encuesta en localStorage
export const saveSurveyDraft = (draft: SurveyDraft) => {
    try {
        const draftString = JSON.stringify(draft);
        window.localStorage.setItem(DRAFT_KEY, draftString);
    } catch (error) {
        console.error("Error al guardar el borrador de la encuesta:", error);
    }
};

// Obtiene el progreso guardado desde localStorage
export const getSurveyDraft = (): SurveyDraft | null => {
    try {
        const draftString = window.localStorage.getItem(DRAFT_KEY);
        if (draftString) {
            return JSON.parse(draftString);
        }
        return null;
    } catch (error) {
        console.error("Error al recuperar el borrador de la encuesta:", error);
        return null;
    }
};

// Limpia el progreso guardado de localStorage
export const clearSurveyDraft = () => {
    try {
        window.localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
        console.error("Error al limpiar el borrador de la encuesta:", error);
    }
};