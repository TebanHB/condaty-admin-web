// src/app/dashboard/surveys/new/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Survey } from '@/types/survey';
import { QuestionBuilder } from './QuestionBuilder';
import { saveSurveyDraft, getSurveyDraft, clearSurveyDraft } from '@/lib/surveyDraft';
// --- 1. IMPORTAMOS EL SERVICIO DE LA API ---
import { createSurvey } from '@/services/surveyApi';

type QuestionState = Survey['questions'][0];

// --- (Los styled-components se mantienen igual) ---
const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 32px;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;
const FormGroup = styled.div`
  margin-bottom: 24px;
`;
const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.primaryBlack};
`;
const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
`;
const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
`;
const AddQuestionButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  background-color: #f8f8f8;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #e8f5e9;
  }
`;
const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
`;
const SaveButton = styled.button<{ $primary?: boolean }>`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background-color: ${({ theme, $primary }) => ($primary ? theme.colors.primary : '#e0e0e0')};
  color: ${({ theme, $primary }) => ($primary ? theme.colors.primaryBlack : theme.colors.text)};
`;

export default function SurveyFormPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<QuestionState[]>([
        { id: `q-${Date.now()}`, text: '', type: 'open_text', options: [] },
    ]);
    const [isLoaded, setIsLoaded] = useState(false);
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === false) {
            const draft = getSurveyDraft();
            if (draft && Object.keys(draft).length > 0) {
                if (window.confirm('Hemos encontrado un borrador sin guardar. ¿Quieres recuperarlo?')) {
                    setTitle(draft.title || '');
                    setDescription(draft.description || '');
                    setQuestions(draft.questions?.length ? draft.questions : [{ id: `q-${Date.now()}`, text: '', type: 'open_text', options: [] }]);
                } else {
                    clearSurveyDraft();
                }
            }
            setIsLoaded(true);
            return () => {
                effectRan.current = true;
            };
        }
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        const surveyDraft = { title, description, questions };
        saveSurveyDraft(surveyDraft);
    }, [title, description, questions, isLoaded]);

    const addQuestion = () => {
        setQuestions([...questions, { id: `q-${Date.now()}`, text: '', type: 'open_text', options: [] }]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const handleQuestionChange = (id: string, updatedQuestion: QuestionState) => {
        setQuestions(questions.map(q => (q.id === id ? updatedQuestion : q)));
    };

    // --- 2. FUNCIÓN handleSave ACTUALIZADA ---
    const handleSave = async (status: 'draft' | 'active') => {
        // Construimos el objeto completo que cumple con la interfaz Survey
        const finalSurvey: Survey = {
            id: `survey-${Date.now()}`,
            title,
            description,
            questions,
            status,
            createdAt: new Date().toISOString(),
            targetAudience: [], // Dejamos esto vacío por ahora
        };

        try {
            // Llamamos a la API para guardar los datos en el archivo JSON
            await createSurvey(finalSurvey);
            alert(`Encuesta guardada como '${status}'!`);
            clearSurveyDraft(); // Limpiamos el borrador de localStorage
            router.push('/dashboard/surveys'); // Redirigimos a la lista
        } catch (error) {
            console.error("Error al guardar la encuesta:", error);
            alert("Hubo un error al guardar la encuesta.");
        }
    };

    return (
        <FormContainer>
            <FormGroup>
                <Label htmlFor="title">Título de la Encuesta</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormGroup>
            {questions.map((question, index) => (
                <QuestionBuilder
                    key={question.id}
                    question={question}
                    index={index}
                    onChange={(updated) => handleQuestionChange(question.id, updated)}
                    onRemove={() => removeQuestion(question.id)}
                />
            ))}
            <AddQuestionButton onClick={addQuestion}>+ Añadir Pregunta</AddQuestionButton>
            <ActionsContainer>
                <SaveButton onClick={() => handleSave('draft')}>Guardar Borrador</SaveButton>
                <SaveButton $primary onClick={() => handleSave('active')}>Guardar y Activar</SaveButton>
            </ActionsContainer>
        </FormContainer>
    );
}