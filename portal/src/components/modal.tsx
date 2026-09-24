import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-bg/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-xl border border-line bg-panel p-8 shadow-[0_12px_32px_rgb(0_0_0_/_45%)]">
        <button
          type="button"
          className="absolute top-4 right-4 text-subtle hover:text-fg"
          aria-label="關閉"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>
        <h3 id="modal-title" className="mb-3 font-display text-xl font-semibold text-fg">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}
