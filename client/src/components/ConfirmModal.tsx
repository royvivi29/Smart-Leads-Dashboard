import type { ReactNode } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string | ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'default';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'default',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6" onClick={onCancel}>
      <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 md:p-6">
          <h3 className="text-[1.1rem] font-bold tracking-tight mb-2 text-stone-900 dark:text-stone-100">
            {title}
          </h3>
          <p className="text-[0.9rem] leading-relaxed text-stone-500 dark:text-stone-400">
            {message}
          </p>
          <div className="flex gap-2 justify-end mt-6">
            <button
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1C1B18] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-md text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onCancel}
              disabled={isLoading}
              id="modal-cancel-btn"
            >
              Cancel
            </button>
            <button
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-orange-600 hover:bg-orange-700'
              }`}
              onClick={onConfirm}
              disabled={isLoading}
              id="modal-confirm-btn"
            >
              {isLoading ? <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Working…</> : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
