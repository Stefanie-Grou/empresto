import type { ToastType } from '../components/Toast';

export interface ToastOptions {
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

export interface ToastItem extends ToastOptions {
  id: number;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener([...toasts]));
}

export function subscribeToasts(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToasts() {
  return [...toasts];
}

export function dismissToast(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

export function showToast(options: ToastOptions) {
  const item: ToastItem = { ...options, id: nextId++ };
  toasts = [...toasts, item];
  emit();
  return item.id;
}

export const toast = {
  success: (title: string, message: string, duration?: number) =>
    showToast({ type: 'success', title, message, duration }),
  error: (title: string, message: string, duration?: number) =>
    showToast({ type: 'error', title, message, duration }),
  warning: (title: string, message: string, duration?: number) =>
    showToast({ type: 'warning', title, message, duration }),
  info: (title: string, message: string, duration?: number) =>
    showToast({ type: 'info', title, message, duration }),
  dismiss: dismissToast,
};
