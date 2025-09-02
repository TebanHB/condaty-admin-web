'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styled from 'styled-components';
import { Survey, SurveyStatus } from '@/types/survey';
import { QuestionBuilder } from './QuestionBuilder';
import { createSurvey, getSurveyById, updateSurvey } from '@/services/surveyApi';

type QuestionState = Survey['questions'][0];

// --- (Todos tus styled-components van aquí) ---
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
const CheckboxGroup = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 8px;
`;
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
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
        targetAudience: [] as string[],
        questions: [] as QuestionState[],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [initialStatus, setInitialStatus] = useState<SurveyStatus>('draft');

    useEffect(() => {
        const controller = new AbortController();
        if (surveyId === 'new') {
            setIsEditMode(false);
            setFormState({
                title: '',
                description: '',
                targetAudience: [],
                questions: [{ id: `q-${Date.now()}`, text: '', type: 'open_text', options: [] }],
            });
            setIsLoading(false);
        } else {
            setIsEditMode(true);
            getSurveyById(surveyId, controller.signal)
                .then(data => {
                    setFormState({
                        title: data.title,
                        description: data.description,
                        targetAudience: data.targetAudience,
                        questions: data.questions,
                    });
                    setInitialStatus(data.status);
                })
                .finally(() => setIsLoading(false));
        }
        return () => controller.abort();
    }, [surveyId]);

    const handleInputChange = (field: 'title' | 'description', value: string) => {
        setFormState(prevState => ({ ...prevState, [field]: value }));
    };

    const handleAudienceChange = (role: string) => {
        setFormState(prevState => {
            const newAudience = [...prevState.targetAudience];
            if (newAudience.includes(role)) {
                return { ...prevState, targetAudience: newAudience.filter(r => r !== role) };
            } else {
                return { ...prevState, targetAudience: [...newAudience, role] };
            }
        });
    };

    // --- FUNCIONES COMPLETAS PARA MANEJAR PREGUNTAS ---
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

    const handleSave = async (newStatus?: SurveyStatus) => {
        const { title, description, questions, targetAudience } = formState;
        try {
            if (isEditMode) {
                const updatedData: Partial<Survey> = { title, description, questions, targetAudience };
                if (newStatus) {
                    updatedData.status = newStatus;
                }
                await updateSurvey(surveyId, updatedData);
                alert('Encuesta actualizada!');
            } else {
                const newSurvey: Survey = {
                    id: `survey-${Date.now()}`,
                    title,
                    description,
                    questions,
                    targetAudience,
                    status: newStatus || 'draft',
                    createdAt: new Date().toISOString(),
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
            <FormGroup>
                <Label>Dirigido a:</Label>
                <CheckboxGroup>
                    <CheckboxLabel>
                        <input type="checkbox" value="resident" checked={formState.targetAudience.includes('resident')} onChange={() => handleAudienceChange('resident')} /> Residentes
                    </CheckboxLabel>
                    <CheckboxLabel>
                        <input type="checkbox" value="guard" checked={formState.targetAudience.includes('guard')} onChange={() => handleAudienceChange('guard')} /> Guardias
                    </CheckboxLabel>
                </CheckboxGroup>
            </FormGroup>

            {formState.questions.map((question, index) => (
                // --- PROPS CORREGIDAS ---
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
                {isEditMode ? (
                    <>
                        <SaveButton onClick={() => handleSave()}>Guardar Cambios</SaveButton>
                        {initialStatus === 'draft' && <SaveButton $primary onClick={() => handleSave('active')}>Guardar y Activar</SaveButton>}
                    </>
                ) : (
                    <>
                        <SaveButton onClick={() => handleSave('draft')}>Guardar Borrador</SaveButton>
                        <SaveButton $primary onClick={() => handleSave('active')}>Guardar y Activar</SaveButton>
                    </>
                )}
            </ActionsContainer>
        </FormContainer>
    );
}