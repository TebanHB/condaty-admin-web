'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Survey, SurveyStatus } from '@/types/survey';
import { getSurveys } from '@/services/surveyApi'; // <-- 1. Usamos el servicio de la API

// --- (Los styled-components se mantienen exactamente igual) ---
const SurveysContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryBlack};
`;

const CreateButton = styled.button`
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryBlack};
  font-weight: 600;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

const SurveyList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const SurveyCard = styled.div<{ status: SurveyStatus }>`
  background-color: white;
  padding: 24px;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-left: 5px solid ${({ theme, status }) => {
    if (status === 'active') return theme.colors.success;
    if (status === 'closed') return theme.colors.danger;
    return theme.colors.secondaryBlack;
  }};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.secondaryBlack};
  margin: 0;
  flex-grow: 1;
`;

const CardActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.secondaryBlack};
  background-color: transparent;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const StatusBadge = styled.span<{ status: SurveyStatus }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background-color: ${({ theme, status }) => {
    if (status === 'active') return theme.colors.success;
    if (status === 'closed') return theme.colors.danger;
    return theme.colors.secondaryBlack;
  }};
`;

// --- Componente de la Página ---
export default function SurveysPage() {
  const router = useRouter();
  // 2. El estado inicial es un array vacío y añadimos un estado de carga
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Usamos useEffect para cargar los datos desde nuestra API al montar el componente
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const data = await getSurveys();
        setSurveys(data);
      } catch (error) {
        console.error("Failed to fetch surveys:", error);
        // Aquí podrías mostrar un mensaje de error al usuario
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveys();
  }, []); // El array vacío asegura que solo se ejecute una vez

  const handleCreateSurvey = () => {
    router.push('/dashboard/surveys/new');
  };

  // 4. Mostramos un mensaje de carga mientras se obtienen los datos
  if (isLoading) {
    return <div>Cargando encuestas...</div>;
  }

  return (
    <SurveysContainer>
      <PageHeader>
        <Title>Módulo de Encuestas</Title>
        <CreateButton onClick={handleCreateSurvey}>+ Crear Nueva Encuesta</CreateButton>
      </PageHeader>

      <SurveyList>
        {surveys.map((survey) => (
          <SurveyCard key={survey.id} status={survey.status}>
            <CardHeader>
              <CardTitle>{survey.title}</CardTitle>
              <StatusBadge status={survey.status}>{survey.status.toUpperCase()}</StatusBadge>
            </CardHeader>
            <CardDescription>{survey.description}</CardDescription>
            <CardActions>
              {survey.status !== 'draft' && <ActionButton>Ver Resultados</ActionButton>}
              {survey.status !== 'closed' && <ActionButton>Editar</ActionButton>}
            </CardActions>
          </SurveyCard>
        ))}
      </SurveyList>
    </SurveysContainer>
  );
}