// jyula-email-frontend-clean-code/src/hooks/useApiFeedback.test.ts
import { renderHook, act } from '@testing-library/react';
import { useApiFeedback } from './useApiFeedback'; // Ajuste o caminho

describe('useApiFeedback', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useApiFeedback());
    expect(result.current.feedback.isOpen).toBe(false);
    expect(result.current.feedback.message).toBe('');
    expect(result.current.feedback.severity).toBe('info');
  });

  it('should initialize with provided initial state', () => {
    const initialState = { isOpen: true, message: 'Initial message', severity: 'success' as const };
    const { result } = renderHook(() => useApiFeedback(initialState));
    expect(result.current.feedback.isOpen).toBe(true);
    expect(result.current.feedback.message).toBe('Initial message');
    expect(result.current.feedback.severity).toBe('success');
  });

  it('should show success message', () => {
    const { result } = renderHook(() => useApiFeedback());
    act(() => {
      result.current.showSuccess('Operation successful!');
    });
    expect(result.current.feedback.isOpen).toBe(true);
    expect(result.current.feedback.message).toBe('Operation successful!');
    expect(result.current.feedback.severity).toBe('success');
  });

  it('should show error message', () => {
    const { result } = renderHook(() => useApiFeedback());
    act(() => {
      result.current.showError('An error occurred.');
    });
    expect(result.current.feedback.isOpen).toBe(true);
    expect(result.current.feedback.message).toBe('An error occurred.');
    expect(result.current.feedback.severity).toBe('error');
  });

  it('should show warning message', () => {
    const { result } = renderHook(() => useApiFeedback());
    act(() => {
      result.current.showWarning('Please check your input.');
    });
    expect(result.current.feedback.isOpen).toBe(true);
    expect(result.current.feedback.message).toBe('Please check your input.');
    expect(result.current.feedback.severity).toBe('warning');
  });

  it('should handle close', () => {
    const { result } = renderHook(() => useApiFeedback({ isOpen: true }));
    act(() => {
      result.current.handleClose();
    });
    expect(result.current.feedback.isOpen).toBe(false);
  });
});