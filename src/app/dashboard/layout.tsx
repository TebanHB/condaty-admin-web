// src/app/dashboard/layout.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Image from 'next/image';

// --- Estilos Inspirados en Condaty.com ---
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.header`
  padding: 0 40px;
  height: 70px;
  background-color: ${({ theme }) => theme.colors.primaryBlack};
  color: ${({ theme }) => theme.colors.primaryWhite};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 40px;
`;

// --- Componente del Layout ---
export default function DashboardLayout({
    children,
}: {
    readonly children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user === null) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return null; // O un spinner de carga para una mejor UX
    }

    return (
        <DashboardContainer>
            <Header>
                <Image
                    src="/Logo-oficial-blanco.png"
                    alt="Logo de Condaty"
                    width={150}
                    height={35}
                    priority
                />
                <UserInfo>
                    <span>Bienvenido, {user.email}</span>
                    <LogoutButton onClick={logout}>Cerrar Sesión</LogoutButton>
                </UserInfo>
            </Header>
            <MainContent>{children}</MainContent>
        </DashboardContainer>
    );
}