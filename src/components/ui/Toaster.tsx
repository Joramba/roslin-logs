import React, { createContext, useContext, useMemo, useState } from "react";
import { nanoid } from "nanoid";

type Variant = "success" | "error" | "info";
type ToastOpts = { title: string; description?: string; variant?: Variant };
type Toast = Required<Omit<ToastOpts, "variant">> & {
  variant: Variant;
  id: string;
};

const ToastContext = createContext<(opts: ToastOpts) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

// Lightweight dependency-free toaster. Each toast auto-dismisses after 3.5s.
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const dismiss = (id: string) =>
    setItems((list) => list.filter((t) => t.id !== id));

  const push = (opts: ToastOpts) => {
    const toast: Toast = {
      id: nanoid(),
      title: opts.title,
      description: opts.description ?? "",
      variant: opts.variant ?? "info",
    };
    setItems((l) => [...l, toast]);
    setTimeout(() => dismiss(toast.id), 3500);
  };

  const variantStyles: Record<Variant, string> = useMemo(
    () => ({
      success: "border-emerald-600 bg-emerald-50 text-emerald-900",
      error: "border-rose-600 bg-rose-50 text-rose-900",
      info: "border-blue-600 bg-blue-50 text-blue-900",
    }),
    []
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      {/* z-index above the modal overlay so toasts are never dimmed */}
      <div
        className="fixed top-4 right-4 flex w-[min(92vw,380px)] flex-col gap-2"
        style={{ zIndex: 999 }}
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            className={`card px-4 py-3 border-l-4 ${
              variantStyles[t.variant]
            } shadow-md`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="font-semibold">{t.title}</div>
                {t.description && (
                  <div className="text-sm opacity-80 leading-snug mt-0.5">
                    {t.description}
                  </div>
                )}
              </div>
              <button
                aria-label="Dismiss"
                onClick={() => dismiss(t.id)}
                className="rounded-md px-2 py-0.5 text-sm hover:bg-black/5"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
