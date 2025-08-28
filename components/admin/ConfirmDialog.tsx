'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'text-danger-600';
      case 'warning':
        return 'text-warning-600';
      case 'info':
        return 'text-primary-600';
      default:
        return 'text-danger-600';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-danger-600 hover:bg-danger-700 focus:ring-danger-500';
      case 'warning':
        return 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-500';
      case 'info':
        return 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500';
      default:
        return 'bg-danger-600 hover:bg-danger-700 focus:ring-danger-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-full bg-${type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : 'primary'}-100`}>
              <ExclamationTriangleIcon className={`h-6 w-6 ${getIconColor()}`} />
            </div>
            <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
          </div>
          
          <p className="text-surface-600 mb-6">{message}</p>
          
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`btn-primary ${getButtonColor()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 