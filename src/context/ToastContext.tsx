import { createContext, useCallback, useState } from "react";
import type { ReactNode } from "react";
import Toast from "@/components/ui/toast/Toast";

// ── Types ──

export type ToastType = "success" | "error" | "info";

export interface ToastOptions {
  type: ToastType;
  title: string;
  subtitle?: string;
  duration?: number; // ms, default 4000
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

// ── Provider ──

let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((options: ToastOptions) => {
    const id = `toast-${++toastCounter}`;
    const toast: ToastItem = { ...options, id };

    setToasts((prev) => [...prev.slice(-2), toast]); // keep max 3

    const duration = options.duration ?? 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container — fixed top-right */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            subtitle={toast.subtitle}
            index={index}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
