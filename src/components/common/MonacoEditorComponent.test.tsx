// jyula-email-frontend-clean-code/src/components/common/MonacoEditorComponent.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MonacoEditorComponent from './MonacoEditorComponent';
import { vi } from 'vitest';

// Mock do @monaco-editor/react
vi.mock('@monaco-editor/react', () => {
  const Editor = ({ value, onChange, defaultValue }) => {
    // Simula o comportamento do editor para testes
    // Não podemos testar a renderização real do Monaco aqui, apenas a interação.
    // O `value` prop não é diretamente usado pelo Editor mock para controlar o input,
    // então usamos um truque para chamar onChange se precisarmos.
    // Para este teste, focamos em defaultValue e onChange.
    return (
      <textarea
        data-testid="monaco-editor-mock"
        defaultValue={defaultValue || value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value, null); // O segundo argumento é o evento, mas não é usado no nosso hook
          }
        }}
      />
    );
  };
  return { default: Editor, __esModule: true, OnChange: vi.fn() };
});


describe('MonacoEditorComponent', () => {
  const mockOnContentChange = vi.fn();

  test('renders with initial content and calls onContentChange', async () => {
    const initialContent = '<p>Hello World</p>';
    render(
      <MonacoEditorComponent
        initialContent={initialContent}
        onContentChange={mockOnContentChange}
      />
    );

    // Verifica se o conteúdo inicial está presente (via mock do editor)
    const editorTextarea = screen.getByTestId('monaco-editor-mock') as HTMLTextAreaElement;
    expect(editorTextarea.value).toBe(initialContent);
    
    // Simula mudança no editor
    fireEvent.change(editorTextarea, { target: { value: '<p>New Content</p>' } });
    
    await waitFor(() => {
        expect(mockOnContentChange).toHaveBeenCalledWith('<p>New Content</p>');
    });
  });

  test('renders HTML and Preview sections by default', () => {
    render(
      <MonacoEditorComponent
        initialContent="test"
        onContentChange={mockOnContentChange}
      />
    );
    expect(screen.getByText('HTML')).toBeInTheDocument();
    expect(screen.getByText('Visualização')).toBeInTheDocument();
  });

  test('does not render Preview when showPreview is false', () => {
    render(
      <MonacoEditorComponent
        initialContent="test"
        onContentChange={mockOnContentChange}
        showPreview={false}
      />
    );
    expect(screen.getByText('HTML')).toBeInTheDocument();
    expect(screen.queryByText('Visualização')).not.toBeInTheDocument();
  });
});