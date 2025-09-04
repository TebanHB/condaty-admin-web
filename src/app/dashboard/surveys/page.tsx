'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Survey, SurveyStatus } from '@/types/survey';
import { getSurveys, updateSurvey } from '@/services/surveyApi';

const SurveysContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
  `;

const ResponseBadge = styled.span`
    background-color: ${({ theme }) => theme.colors.info};
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
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
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const TitleAndResponse = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-grow: 1;
    min-width: 0;
  `;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
`;

const Spacer = styled.div`
  flex-grow: 1; 
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

const CloseButton = styled(ActionButton)`
    border-color: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.danger};
    &:hover {
      background-color: #ffebee;
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
    flex-shrink: 0;
  `;

export default function SurveysPage() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();

    const fetchSurveys = async () => {
      try {
        const data = await getSurveys(controller.signal);
        setSurveys(data);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Failed to fetch surveys:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveys();
    return () => {
      controller.abort();
    };
  }, []);

  const handleCreateSurvey = () => {
    router.push('/dashboard/surveys/new');
  };

  const handleCloseSurvey = async (surveyId: string) => {
    if (window.confirm('¿Estás seguro de que quieres cerrar esta encuesta? No se podrá volver a abrir.')) {
      try {
        await updateSurvey(surveyId, { status: 'closed' });
        setSurveys(prevSurveys =>
          prevSurveys.map(s =>
            s.id === surveyId ? { ...s, status: 'closed' } : s
          )
        );
        alert('Encuesta cerrada con éxito.');
      } catch (error) {
        console.error('Error al cerrar la encuesta:', error);
        alert('No se pudo cerrar la encuesta.');
      }
    }
  };

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
              <TitleAndResponse>
                <CardTitle title={survey.title}>{survey.title}</CardTitle>
                <Spacer />

                {survey.status !== 'draft' && (
                  <ResponseBadge>
                    {survey.responseCount}
                  </ResponseBadge>
                )}
              </TitleAndResponse>
              <StatusBadge status={survey.status}>{survey.status.toUpperCase()}</StatusBadge>
            </CardHeader>
            <CardDescription>{survey.description}</CardDescription>
            <CardActions>
              {survey.status !== 'draft' && <ActionButton onClick={() => router.push(`/dashboard/surveys/results/${survey.id}`)}>
                Ver Resultados
              </ActionButton>
              }
              {survey.status !== 'closed' && <ActionButton onClick={() => router.push(`/dashboard/surveys/${survey.id}`)}>
                Editar
              </ActionButton>}
              {survey.status === 'active' &&
                <CloseButton onClick={() => handleCloseSurvey(survey.id)}>
                  Cerrar
                </CloseButton>}
            </CardActions>
          </SurveyCard>
        ))}
      </SurveyList>
    </SurveysContainer>
  );
}