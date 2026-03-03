import { create } from 'zustand';
import { Toast } from '../types';

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { ...toast, id };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const useToast = () => {
  const { addToast, removeToast } = useToastStore();

  return {
    toast: {
      success: (title: string, message?: string) =>
        addToast({ type: 'success', title, message }),
      error: (title: string, message?: string) =>
        addToast({ type: 'error', title, message, duration: 6000 }),
      warning: (title: string, message?: string) =>
        addToast({ type: 'warning', title, message }),
      info: (title: string, message?: string) =>
        addToast({ type: 'info', title, message }),
    },
    removeToast,
  };
};
