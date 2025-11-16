import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [onDismiss, duration]);

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 py-3 bg-slate-800/90 backdrop-blur-sm border border-slate-700 text-white rounded-xl shadow-2xl text-center animate-fade-in-down"
      role="alert"
    >
      <p>{message}</p>
    </div>
  );
};

export default Toast;