// src/app/dashboard/surveys/new/QuestionBuilder.tsx
'use client';

import styled from 'styled-components';
import { Survey } from '@/types/survey';

type QuestionState = Survey['questions'][0];

interface QuestionBuilderProps {
    question: QuestionState;
    index: number;
    onChange: (updatedQuestion: QuestionState) => void;
    onRemove: () => void;
}

// --- Estilos ---
const QuestionContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  margin-top: 16px;
  background-color: #fafafa;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const QuestionTitle = styled.h4`
  margin: 0;
  font-weight: 600;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  font-weight: 600;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const OptionsContainer = styled.div`
  padding-left: 24px;
  border-left: 3px solid #e0e0e0;
`;

const OptionInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const AddOptionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.info};
  cursor: pointer;
  font-weight: 600;
  margin-top: 8px;
`;

// --- Componente ---
export const QuestionBuilder = ({ question, index, onChange, onRemove }: QuestionBuilderProps) => {

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...question, text: e.target.value });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Al cambiar de tipo, reseteamos las opciones si no es de selección
        const newType = e.target.value;
        const newOptions = (newType === 'single_choice' || newType === 'multiple_choice') ? question.options : [];
        onChange({ ...question, type: newType, options: newOptions });
    };

    const handleOptionChange = (optionIndex: number, value: string) => {
        const newOptions = [...question.options];
        newOptions[optionIndex] = value;
        onChange({ ...question, options: newOptions });
    };

    const addOption = () => {
        onChange({ ...question, options: [...question.options, 'Nueva Opción'] });
    };

    const removeOption = (optionIndex: number) => {
        const newOptions = question.options.filter((_, i) => i !== optionIndex);
        onChange({ ...question, options: newOptions });
    };

    return (
        <QuestionContainer>
            <QuestionHeader>
                <QuestionTitle>Pregunta {index + 1}</QuestionTitle>
                <RemoveButton onClick={onRemove}>Eliminar</RemoveButton>
            </QuestionHeader>
            <Row>
                <Input placeholder="Escribe tu pregunta aquí..." value={question.text} onChange={handleTextChange} />
                <Select value={question.type} onChange={handleTypeChange}>
                    <option value="open_text">Texto Abierto</option>
                    <option value="single_choice">Selección Única</option>
                    <option value="multiple_choice">Selección Múltiple</option>
                </Select>
            </Row>

            {(question.type === 'single_choice' || question.type === 'multiple_choice') && (
                <OptionsContainer>
                    <label>Opciones de Respuesta:</label>
                    {question.options.map((option, i) => (
                        <OptionInputGroup key={i}>
                            <Input value={option} onChange={(e) => handleOptionChange(i, e.target.value)} />
                            <RemoveButton onClick={() => removeOption(i)}>X</RemoveButton>
                        </OptionInputGroup>
                    ))}
                    <AddOptionButton onClick={addOption}>+ Añadir Opción</AddOptionButton>
                </OptionsContainer>
            )}
        </QuestionContainer>
    );
};