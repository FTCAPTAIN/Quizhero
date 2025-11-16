import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BoltIcon } from './Icons';

interface SurvivalResultsScreenProps {
  wave: number;
  score: number;
  correctAnswers: number;
  totalAnswered: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

const SurvivalResultsScreen: React.FC<SurvivalResultsScreenProps> = ({ wave, score, correctAnswers, totalAnswered, onPlayAgain, onGoHome }) => {
  const { t } = useLanguage();
  const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-slate-900 to-red-900/50 text-white p-4 animate-fade-in">
        <div className="text-center">
            <BoltIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-6xl font-extrabold text-red-500 tracking-tighter">{t('game_over')}</h1>
            
            <div className="mt-8 flex items-end justify-center gap-4">
                <div>
                    <p className="text-lg text-slate-400">{t('wave_reached')}</p>
                    <p className="text-8xl font-bold text-white">{wave}</p>
                </div>
                <div>
                    <p className="text-lg text-slate-400">{t('finalScore')}</p>
                    <p className="text-5xl font-bold text-orange-400">{score}</p>
                </div>
            </div>

            <div className="my-8 w-full max-w-sm mx-auto grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-xl">
                    <p className="text-sm text-slate-400">{t('correctAnswers')}</p>
                    <p className="text-3xl font-bold text-green-400">{correctAnswers} / {totalAnswered}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl">
                    <p className="text-sm text-slate-400">{t('accuracy')}</p>
                    <p className="text-3xl font-bold text-cyan-400">{accuracy}%</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                <button
                    onClick={onPlayAgain}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-xl"
                >
                    {t('playAgain')}
                </button>
                <button
                    onClick={onGoHome}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-xl"
                >
                    {t('backToHome')}
                </button>
            </div>
        </div>
    </div>
  );
};

export default SurvivalResultsScreen;
