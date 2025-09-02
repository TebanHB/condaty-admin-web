'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import { SurveyResponse, SurveyResults } from '@/types/survey';
import { getSurveyResults } from '@/services/surveyApi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// --- (Styled Components se mantienen igual) ---
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
  margin-top: 24px;
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

export default function ResultsPage() {
    const params = useParams();
    const surveyId = params.id as string;
    const [results, setResults] = useState<SurveyResults | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (surveyId) {
            getSurveyResults(surveyId)
                .then(data => setResults(data))
                .finally(() => setIsLoading(false));
        }
    }, [surveyId]);

    if (isLoading) return <div>Cargando resultados...</div>;
    if (!results) return <div>No se encontraron resultados para esta encuesta.</div>;

    const { survey, responses } = results;

    const processChartData = (questionId: string, options: string[]) => {
        const counts = options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {} as Record<string, number>);

        // --- 2. AÑADIMOS TIPOS EXPLÍCITOS ---
        responses.forEach((response: SurveyResponse) => {
            const answer = response.answers.find(a => a.questionId === questionId);
            if (answer && answer.value) {
                if (Array.isArray(answer.value)) {
                    answer.value.forEach((val: string) => { if (counts[val] !== undefined) counts[val]++; });
                } else {
                    if (counts[answer.value as string] !== undefined) counts[answer.value as string]++;
                }
            }
        });

        return {
            labels: Object.keys(counts),
            datasets: [{
                label: 'Votos',
                data: Object.values(counts),
                backgroundColor: ['#00E38C', '#1C65F2', '#F89634', '#FF5B4D', '#A7A7A7'],
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

            {survey.questions.map((question) => (
                <QuestionCard key={question.id}>
                    <h3>{question.text}</h3>
                    {question.type === 'open_text' && (
                        <OpenAnswerList>
                            {responses.map((r: SurveyResponse) => {
                                const answer = r.answers.find(a => a.questionId === question.id);
                                return answer && answer.value ? <li key={r.responseId}>{`"${answer.value}"`}</li> : null;
                            })}
                        </OpenAnswerList>
                    )}
                    {(question.type === 'single_choice' || question.type === 'multiple_choice') && (
                        <ChartContainer>
                            <Bar data={processChartData(question.id, question.options)} />
                        </ChartContainer>
                    )}
                </QuestionCard>
            ))}
        </ResultsContainer>
    );
}