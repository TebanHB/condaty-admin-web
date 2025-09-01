// src/app/dashboard/layout.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link'; // <-- 1. Importamos el componente Link

// --- Estilos ---
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

// Nuevo: Contenedor para agrupar Logo y Navegación
const HeaderPrimary = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

// Nuevo: Contenedor para los enlaces de navegación
const NavLinks = styled.nav`
  display: flex;
  gap: 20px;
`;

// Nuevo: Estilo para cada enlace de navegación
const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondaryBlack};
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.thirdBlack};
    color: ${({ theme }) => theme.colors.primaryWhite};
  }
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
    return null;
  }

  return (
    <DashboardContainer>
      <Header>
        <HeaderPrimary>
          <Link href="/dashboard">
            <Image
              src="/Logo-oficial-blanco.png"
              alt="Logo de Condaty"
              width={150}
              height={35}
              priority
            />
          </Link>
          {/* 2. Añadimos la sección de navegación */}
          <NavLinks>
            <NavLink href="/dashboard/surveys">Encuestas</NavLink>
            {/* Aquí podrías añadir más enlaces en el futuro */}
          </NavLinks>
        </HeaderPrimary>
        <UserInfo>
          <span>Bienvenido, {user.email}</span>
          <LogoutButton onClick={logout}>Cerrar Sesión</LogoutButton>
        </UserInfo>
      </Header>
      <MainContent>{children}</MainContent>
    </DashboardContainer>
  );
}