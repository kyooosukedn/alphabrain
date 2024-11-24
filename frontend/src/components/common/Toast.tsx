import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUI } from '../../context/UIContext';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const toastTypeStyles = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
};

const Toast: React.FC<ToastProps> = ({ id, message, type }) => {
  const { removeToast } = useUI();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`${toastTypeStyles[type]} rounded-lg shadow-lg p-4 mb-4 text-white min-w-[300px] flex items-center justify-between`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => removeToast(id)}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useUI();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
