import React from 'react';
import { Icon } from '@iconify/react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  warningMessage?: string;
  cancelLabel?: string;
  submitLabel?: string;
  onConfirmSubmit?: () => void;
  extraActions?: React.ReactNode;
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  warningMessage,
  cancelLabel = 'Cancelar',
  submitLabel, 
  extraActions,
}: BaseModalProps) {
  if (!isOpen) return null;

  const showSubmitButton = Boolean(submitLabel && submitLabel.trim() !== '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 text-center w-full">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Formulário */}
        <form onSubmit={onSubmit} className="p-8 space-y-5">
          {children}

          {/* Mensagem de Aviso */}
          {warningMessage && (
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <div className="w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center shrink-0">
                <Icon icon="lucide:alert-triangle" className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm font-medium text-gray-700 leading-snug">
                {warningMessage}
              </p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 gray-button-with-hover"
            >
              {cancelLabel}
            </button>

            {extraActions}

            {showSubmitButton && (
              <button
                type="submit"
                className="px-10 py-3 green-button-with-hover"
              >
                {submitLabel}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}