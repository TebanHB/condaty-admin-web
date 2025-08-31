'use client';

import { useAuth } from '@/context/AuthContext';
import styled from 'styled-components';

const WelcomeContainer = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const HighlightText = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
`;

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <WelcomeContainer>
            <h1>¡Bienvenido al Panel de Administrador!</h1>
            <p>Has iniciado sesión como: <strong>{user.email}</strong></p>
            <p>Tu rol es: <HighlightText>{user.role}</HighlightText></p>
            <p style={{ marginTop: "20px" }}>Desde aquí podrás gestionar todas las encuestas de la comunidad.</p>
        </WelcomeContainer>
    );
}