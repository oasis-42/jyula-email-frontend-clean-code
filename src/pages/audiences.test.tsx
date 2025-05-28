// jyula-email-frontend-clean-code/src/pages/audiences.test.tsx
import { render, screen, fireEvent, within } from '@testing-library/react';
import AudiencesPage from './audiences';
import { vi } from 'vitest';

describe('AudiencesPage', () => {
  // O beforeEach pode ser útil se houver mocks complexos ou estado global para resetar.
  // Neste caso, como o estado é interno ao componente e reiniciado a cada render,
  // ele é opcional.
  beforeEach(() => {
    // Exemplo: vi.clearAllMocks(); se estivéssemos mockando módulos externos.
  });

  test('renders initial contacts', () => {
    render(<AudiencesPage />);
    expect(screen.getByText('Contato 1')).toBeInTheDocument();
    expect(screen.getByText('teste01.contato@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('Contato 2')).toBeInTheDocument();
    expect(screen.getByText('teste02.contato@gmail.com')).toBeInTheDocument();
  });

  test('adds a new contact', () => {
    render(<AudiencesPage />);
    
    const nicknameInput = screen.getByRole('textbox', { name: /apelido do contato/i });
    const emailInput = screen.getByRole('textbox', { name: /endereço de e-mail/i });
    // Busca o botão pelo seu conteúdo visual (ícone Add) ou um label acessível.
    // Se o botão contiver apenas um ícone, um aria-label seria ideal para acessibilidade e testes.
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(nicknameInput, { target: { value: 'Novo Contato' } });
    fireEvent.change(emailInput, { target: { value: 'novo@example.com' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Novo Contato')).toBeInTheDocument();
    expect(screen.getByText('novo@example.com')).toBeInTheDocument();
  });

  test('deletes a contact', () => {
    render(<AudiencesPage />);
    expect(screen.getByText('Contato 1')).toBeInTheDocument();

    const contact1Card = screen.getByText('Contato 1').closest('div.MuiCard-root');
    expect(contact1Card).not.toBeNull();

    // Idealmente, os botões de ação teriam seletores mais estáveis (ex: data-testid ou aria-label).
    // A busca por conteúdo de innerHTML (ícones) pode ser frágil.
    const deleteButton = within(contact1Card!).getAllByRole('button')
                           .find(btn => btn.querySelector('svg[data-testid="DeleteOutlineOutlinedIcon"]')); // Exemplo se o ícone tivesse data-testid

    // Se o seletor acima não funcionar, e assumindo uma ordem ou outro atributo:
    // Para este teste, vamos simular que encontramos o botão de alguma forma.
    // Se os botões tivessem aria-label="Deletar Contato 1", seria:
    // const deleteButton = within(contact1Card!).getByRole('button', { name: /deletar contato 1/i });
    // Por ora, vamos encontrar todos os botões no card e pegar o que parece ser o de deleção (ex: o segundo)
    const actionButtons = within(contact1Card!).getAllByRole('button');
    // Esta é uma suposição para o teste funcionar, melhore os seletores no seu componente.
    if (actionButtons.length > 1) { 
        fireEvent.click(actionButtons[1]); // Assumindo que o segundo botão é "Deletar"
    } else if (actionButtons.length === 1 && actionButtons[0].innerHTML.includes("Delete")) { // Fallback se só houver um botão com "Delete"
        fireEvent.click(actionButtons[0]);
    } else {
        throw new Error("Botão de deletar não encontrado para 'Contato 1'. Considere adicionar seletores melhores.");
    }

    expect(screen.queryByText('Contato 1')).not.toBeInTheDocument();
  });

  test('edits a contact', () => {
    render(<AudiencesPage />);
    const contact1Card = screen.getByText('Contato 1').closest('div.MuiCard-root');
    expect(contact1Card).not.toBeNull();

    // Encontrar e clicar no botão de editar para "Contato 1"
    // Similar ao delete, um seletor estável é preferível.
    const editButton = within(contact1Card!).getAllByRole('button')
                         .find(btn => btn.querySelector('svg[data-testid="EditOutlinedIcon"]')); // Exemplo
    
    const actionButtonsForEdit = within(contact1Card!).getAllByRole('button');
     if (actionButtonsForEdit.length > 0) {
        fireEvent.click(actionButtonsForEdit[0]); // Assumindo que o primeiro botão é "Editar"
    } else {
        throw new Error("Botão de editar não encontrado para 'Contato 1'. Considere adicionar seletores melhores.");
    }
    
    const nicknameEditInput = screen.getByDisplayValue('Contato 1') as HTMLInputElement;
    const emailEditInput = screen.getByDisplayValue('teste01.contato@gmail.com') as HTMLInputElement;

    fireEvent.change(nicknameEditInput, { target: { value: 'Contato 1 Editado' } });
    fireEvent.change(emailEditInput, { target: { value: 'editado@example.com' } });

    // Encontrar e clicar no botão de salvar
    const saveButton = within(contact1Card!).getAllByRole('button')
                        .find(btn => btn.querySelector('svg[data-testid="SaveAsIcon"]')); // Exemplo
    
    const actionButtonsForSave = within(contact1Card!).getAllByRole('button');
     if (actionButtonsForSave.length > 0) { // O botão de salvar substitui o de editar
        fireEvent.click(actionButtonsForSave[0]); // Assumindo que o primeiro (e único visível) é "Salvar"
    } else {
        throw new Error("Botão de salvar não encontrado para 'Contato 1'. Considere adicionar seletores melhores.");
    }


    expect(screen.getByText('Contato 1 Editado')).toBeInTheDocument();
    expect(screen.getByText('editado@example.com')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Contato 1')).not.toBeInTheDocument();
  });

  test('shows warning if trying to add contact with empty fields', () => {
    render(<AudiencesPage />);
    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);
    expect(screen.getByText(/por favor, preencha todos os campos antes de salvar/i)).toBeInTheDocument();
  });
});