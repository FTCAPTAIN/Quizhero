import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ErrorIcon } from './Icons';

interface ErrorScreenProps {
  errorTitle: string;
  errorMessage: string;
  onRetry?: () => void;
  onGoHome: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ errorTitle, errorMessage, onRetry, onGoHome }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center h-full text-white text-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-2xl p-8 flex flex-col items-center shadow-lg">
        <ErrorIcon className="w-20 h-20 text-red-500 mb-6" />
        <h2 className="text-3xl font-bold text-slate-100 mb-2">{errorTitle}</h2>
        <p className="text-slate-400 mb-8">{errorMessage}</p>
        <div className="w-full flex flex-col sm:flex-row gap-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg"
            >
              {t('error_retry')}
            </button>
          )}
          <button
            onClick={onGoHome}
            className={`w-full font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg ${
              onRetry ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
            }`}
          >
            {t('backToHome')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
