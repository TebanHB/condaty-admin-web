'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styled from 'styled-components';
import { Survey } from '@/types/survey';
import { QuestionBuilder } from './QuestionBuilder';
import { createSurvey, getSurveyById, updateSurvey } from '@/services/surveyApi';

type QuestionState = Survey['questions'][0];

// --- (Copia y pega todos tus styled-components aquí) ---
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
    const params = useParams();
    const surveyId = params.id as string;

    const [isEditMode, setIsEditMode] = useState(false);
    const [formState, setFormState] = useState({
        title: '',
        description: '',
        questions: [] as QuestionState[],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (surveyId === 'new') {
            setIsEditMode(false);
            setFormState({
                title: '',
                description: '',
                questions: [{ id: `q-${Date.now()}`, text: '', type: 'open_text', options: [] }],
            });
            setIsLoading(false);
        } else {
            setIsEditMode(true);
            getSurveyById(surveyId)
                .then(data => {
                    setFormState({
                        title: data.title,
                        description: data.description,
                        questions: data.questions,
                    });
                })
                .finally(() => setIsLoading(false));
        }
    }, [surveyId]);

    const handleInputChange = (field: 'title' | 'description', value: string) => {
        setFormState(prevState => ({ ...prevState, [field]: value }));
    };

    // --- 1. AÑADIMOS LAS FUNCIONES PARA MANEJAR LAS PREGUNTAS ---
    const addQuestion = () => {
        setFormState(prevState => ({
            ...prevState,
            questions: [
                ...prevState.questions,
                { id: `q-${Date.now()}`, text: '', type: 'open_text', options: [] }
            ]
        }));
    };

    const removeQuestion = (id: string) => {
        setFormState(prevState => ({
            ...prevState,
            questions: prevState.questions.filter(q => q.id !== id)
        }));
    };

    const handleQuestionChange = (id: string, updatedQuestion: QuestionState) => {
        setFormState(prevState => ({
            ...prevState,
            questions: prevState.questions.map(q => (q.id === id ? updatedQuestion : q)),
        }));
    };

    const handleSave = async () => {
        const { title, description, questions } = formState;
        try {
            if (isEditMode) {
                await updateSurvey(surveyId, { title, description, questions });
                alert('Encuesta actualizada!');
            } else {
                const newSurvey: Survey = {
                    id: `survey-${Date.now()}`,
                    title,
                    description,
                    questions,
                    status: 'draft',
                    createdAt: new Date().toISOString(),
                    targetAudience: [],
                };
                await createSurvey(newSurvey);
                alert('Encuesta creada!');
            }
            router.push('/dashboard/surveys');
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("No se pudo guardar la encuesta.");
        }
    };

    if (isLoading) return <div>Cargando...</div>;

    return (
        <FormContainer>
            <h1>{isEditMode ? 'Editar Encuesta' : 'Crear Nueva Encuesta'}</h1>
            <FormGroup>
                <Label htmlFor="title">Título de la Encuesta</Label>
                <Input id="title" value={formState.title} onChange={(e) => handleInputChange('title', e.target.value)} />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" value={formState.description} onChange={(e) => handleInputChange('description', e.target.value)} />
            </FormGroup>

            {formState.questions.map((question, index) => (
                // --- 2. PASAMOS LAS PROPS CORRECTAS AL COMPONENTE ---
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
                <SaveButton $primary onClick={handleSave}>
                    {isEditMode ? 'Guardar Cambios' : 'Guardar Encuesta'}
                </SaveButton>
            </ActionsContainer>
        </FormContainer>
    );
}