import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore } from '../../hooks/useToast';
import { Toast as ToastType } from '../../types';

const icons: Record<ToastType['type'], React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

const borderClasses: Record<ToastType['type'], string> = {
  success: 'border-l-4 border-green-500',
  error: 'border-l-4 border-red-500',
  warning: 'border-l-4 border-amber-500',
  info: 'border-l-4 border-blue-500',
};

const ToastItem: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { removeToast } = useToastStore();

  return (
    <div
      className={`
        flex items-start gap-3 w-full max-w-sm
        bg-white dark:bg-slate-800 rounded-lg shadow-lg shadow-black/10
        border border-slate-200 dark:border-slate-700
        ${borderClasses[toast.type]}
        p-4 animate-slide-up
      `}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
