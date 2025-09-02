'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import { SurveyResponse, SurveyResults } from '@/types/survey';
import { getSurveyResults } from '@/services/surveyApi';
// 1. IMPORTAMOS LOS GRÁFICOS QUE USAREMOS
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// 2. REGISTRAMOS LOS ELEMENTOS NECESARIOS (ArcElement es para Pie)
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// --- Styled Components ---
const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const Header = styled.div`
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;
const QuestionCard = styled.div`
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;
const ChartContainer = styled.div`
  max-width: 600px;
  margin: 24px auto 0;
`;
const OpenAnswerList = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
  margin-top: 16px;
  li {
    margin-bottom: 8px;
    padding-left: 10px;
    border-left: 3px solid #eee;
  }
`;
// --- NUEVOS ESTILOS PARA LOS BOTONES DE GRÁFICO ---
const ChartTypeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
`;

const ChartTypeButton = styled.button<{ $isActive: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.secondaryBlack};
  cursor: pointer;
  font-weight: 600;
  background-color: ${({ $isActive, theme }) => $isActive ? theme.colors.primary : 'transparent'};
  color: ${({ $isActive, theme }) => $isActive ? theme.colors.primaryBlack : theme.colors.text};
`;


export default function ResultsPage() {
    const params = useParams();
    const surveyId = params.id as string;
    const [results, setResults] = useState<SurveyResults | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // 3. ESTADO PARA CONTROLAR EL TIPO DE GRÁFICO POR PREGUNTA
    const [chartTypes, setChartTypes] = useState<Record<string, 'bar' | 'pie'>>({});

    useEffect(() => {
        if (surveyId) {
            getSurveyResults(surveyId)
                .then(data => setResults(data))
                .finally(() => setIsLoading(false));
        }
    }, [surveyId]);

    // Función para cambiar el tipo de gráfico de una pregunta específica
    const handleChartTypeChange = (questionId: string, type: 'bar' | 'pie') => {
        setChartTypes(prev => ({ ...prev, [questionId]: type }));
    };

    if (isLoading) return <div>Cargando resultados...</div>;
    if (!results) return <div>No se encontraron resultados para esta encuesta.</div>;

    const { survey, responses } = results;

    const processChartData = (questionId: string, options: string[]) => {
        const counts = options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {} as Record<string, number>);
        responses.forEach((response: SurveyResponse) => {
            const answer = response.answers.find(a => a.questionId === questionId);
            if (answer?.value) {
                if (Array.isArray(answer.value)) {
                    answer.value.forEach((val: string) => { if (counts[val] !== undefined) counts[val]++; });
                }
                if (!Array.isArray(answer.value) && counts[answer.value] !== undefined) {
                    counts[answer.value]++;
                }
            }
        });
        return {
            labels: Object.keys(counts),
            datasets: [{
                label: 'Votos',
                data: Object.values(counts),
                backgroundColor: ['#00E38C', '#1C65F2', '#F89634', '#FF5B4D', '#A7A7A7', '#333536'],
            }],
        };
    };

    return (
        <ResultsContainer>
            <Header>
                <h1>{survey.title}</h1>
                <p>{survey.description}</p>
                <hr />
                <h2>Total de Respuestas Recibidas: {responses.length}</h2>
            </Header>

            {survey.questions.map((question) => {
                // Obtenemos el tipo de gráfico para esta pregunta, por defecto 'bar'
                const chartType = chartTypes[question.id] || 'bar';

                return (
                    <QuestionCard key={question.id}>
                        <h3>{question.text}</h3>
                        {question.type === 'open_text' ? (
                            <OpenAnswerList>
                                {responses.map((r: SurveyResponse) => {
                                    const answer = r.answers.find(a => a.questionId === question.id);
                                    return answer?.value ? <li key={r.responseId}>{`"${answer.value}"`}</li> : null;
                                })}
                            </OpenAnswerList>
                        ) : (
                            <>
                                {/* 4. BOTONES PARA CAMBIAR EL GRÁFICO */}
                                <ChartTypeSelector>
                                    <ChartTypeButton $isActive={chartType === 'bar'} onClick={() => handleChartTypeChange(question.id, 'bar')}>Barras</ChartTypeButton>
                                    <ChartTypeButton $isActive={chartType === 'pie'} onClick={() => handleChartTypeChange(question.id, 'pie')}>Torta</ChartTypeButton>
                                </ChartTypeSelector>

                                <ChartContainer>
                                    {/* 5. RENDERIZADO CONDICIONAL DEL GRÁFICO */}
                                    {chartType === 'bar' && <Bar data={processChartData(question.id, question.options)} />}
                                    {chartType === 'pie' && <Pie data={processChartData(question.id, question.options)} />}
                                </ChartContainer>
                            </>
                        )}
                    </QuestionCard>
                )
            })}
        </ResultsContainer>
    );
}