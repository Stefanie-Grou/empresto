import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  type: ToastType;
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    bgGradient: 'from-emerald-50/80 via-white to-white border-emerald-100',
    iconBox: 'bg-emerald-50 text-emerald-500 border-emerald-100',
    progressBar: 'bg-emerald-500',
    icon: 'lucide:circle-check',
  },
  error: {
    bgGradient: 'from-red-50/80 via-white to-white border-red-100',
    iconBox: 'bg-red-50 text-red-500 border-red-100',
    progressBar: 'bg-red-500',
    icon: 'lucide:circle-alert',
  },
  warning: {
    bgGradient: 'from-amber-50/80 via-white to-white border-amber-100',
    iconBox: 'bg-amber-50 text-amber-500 border-amber-100',
    progressBar: 'bg-amber-500',
    icon: 'lucide:triangle-alert',
  },
  info: {
    bgGradient: 'from-blue-50/80 via-white to-white border-blue-100',
    iconBox: 'bg-blue-50 text-blue-500 border-blue-100',
    progressBar: 'bg-blue-500',
    icon: 'lucide:info',
  },
};

export function Toast({ type, title, message, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progressWidth, setProgressWidth] = useState('100%');
  const isClosingRef = useRef(false);

  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      setProgressWidth('0%');
    }, 20);

    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [duration]);

  const config = toastConfig[type];

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3.5 p-4 pb-5 min-w-[320px] max-w-sm bg-gradient-to-r ${config.bgGradient} bg-white rounded-2xl border shadow-xl shadow-gray-200/60 overflow-hidden transform transition-all duration-300 ease-out ${
        isVisible
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${config.iconBox}`}
      >
        <Icon icon={config.icon} className="w-5 h-5" />
      </div>

      <div className="flex-1 pt-0.5 pr-2">
        <h4 className="font-jakarta font-semibold text-gray-900 text-sm leading-none">
          {title}
        </h4>
        <p className="font-inter text-gray-500 text-xs mt-1.5 leading-relaxed">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1 -mt-1 rounded-lg cursor-pointer"
        aria-label="Fechar"
      >
        <Icon icon="lucide:x" className="w-4 h-4" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100/70 overflow-hidden">
        <div
          className={`h-full ${config.progressBar}`}
          style={{
            width: progressWidth,
            transition: `width ${duration}ms linear`,
          }}
        />
      </div>
    </div>
  );
}

export default Toast;
