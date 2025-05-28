// jyula-email-frontend-clean-code/src/hooks/useApiFeedback.ts
import { useState } from "react";

type FeedbackSeverity = "success" | "error" | "warning" | "info";

interface ApiFeedbackState {
  isOpen: boolean;
  message: string;
  severity: FeedbackSeverity;
}

interface UseApiFeedbackReturn {
  feedback: ApiFeedbackState;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  handleClose: () => void;
}

export function useApiFeedback(initialState?: Partial<ApiFeedbackState>): UseApiFeedbackReturn {
  const [feedback, setFeedback] = useState<ApiFeedbackState>({
    isOpen: initialState?.isOpen ?? false,
    message: initialState?.message ?? "",
    severity: initialState?.severity ?? "info",
  });

  const showFeedback = (message: string, severity: FeedbackSeverity) => {
    setFeedback({ isOpen: true, message, severity });
  };

  const showSuccess = (message: string) => showFeedback(message, "success");
  const showError = (message: string) => showFeedback(message, "error");
  const showWarning = (message: string) => showFeedback(message, "warning");

  const handleClose = () => {
    setFeedback((prev) => ({ ...prev, isOpen: false }));
  };

  return { feedback, showSuccess, showError, showWarning, handleClose };
}