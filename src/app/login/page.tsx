// src/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react'; // Importa useEffect
import { useAuth } from '@/context/AuthContext';
import styled from 'styled-components';
import { useRouter } from 'next/navigation'; // Importa useRouter

// --- (Los styled-components se mantienen igual) ---
const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const LoginForm = styled.form`
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.secondaryBlack};
  font-size: 24px;
  text-align: center;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #005bb5;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
  margin-top: 16px;
`;

// --- Componente de la Página ---
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user, loading } = useAuth(); // Obtenemos 'user' y 'loading'
  const router = useRouter();

  // Este efecto se encarga de redirigir si el usuario ya está logueado
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  // Mientras se verifica la sesión o si ya hay un usuario,
  // no mostramos el formulario. Esto soluciona el error de hidratación.
  if (loading || user) {
    return null; // O puedes mostrar un spinner aquí
  }

  // Solo muestra el formulario si la carga ha terminado y no hay usuario
  return (
    <LoginPageContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Bienvenido a Condaty</Title>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@admin.com"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña (12345678)"
          required
        />
        <Button type="submit">Entrar</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginForm>
    </LoginPageContainer>
  );
}