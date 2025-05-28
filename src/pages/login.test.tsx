// jyula-email-frontend-clean-code/src/pages/login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './login'; // Ajuste o caminho conforme necessário
import { vi } from 'vitest';

describe('LoginPage', () => {
  const mockOnSuccessfulLogin = vi.fn();

  beforeEach(() => {
    // Limpa mocks antes de cada teste
    mockOnSuccessfulLogin.mockClear();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <LoginPage onSuccessfulLogin={mockOnSuccessfulLogin} />
      </BrowserRouter>
    );
  };

  test('renders login form correctly', () => {
    renderComponent();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByText(/sem conta\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cadastrar-se/i })).toBeInTheDocument();
  });

  test('allows user to type in email and password fields', () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/senha/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('calls onSuccessfulLogin when fake credentials are correct', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'usuario@teste.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockOnSuccessfulLogin).toHaveBeenCalledTimes(1);
    });
  });

  test('does not call onSuccessfulLogin when fake credentials are incorrect', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
        // Adiciona um pequeno delay para garantir que qualquer lógica assíncrona (mesmo mock) tenha chance de rodar
    });

    expect(mockOnSuccessfulLogin).not.toHaveBeenCalled();
  });
});