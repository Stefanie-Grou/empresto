import { useEffect, useState } from 'react';
import Toast from './Toast';
import { subscribeToasts, getToasts, dismissToast, type ToastItem } from '../services/toastStore';

export default function ToastProvider() {
  const [items, setItems] = useState<ToastItem[]>(getToasts);

  useEffect(() => subscribeToasts(setItems), []);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] flex flex-col-reverse items-end gap-3 p-6 pointer-events-none">
      {items.map((item) => (
        <div key={item.id} className="relative pointer-events-auto">
          <Toast
            type={item.type}
            title={item.title}
            message={item.message}
            duration={item.duration}
            onClose={() => dismissToast(item.id)}
          />
        </div>
      ))}
    </div>
  );
}
