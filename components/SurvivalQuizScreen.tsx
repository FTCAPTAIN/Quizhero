import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { playSound } from '../lib/audioUtils';
import { HeartIcon, ExitIcon } from './Icons';
import { useQuizTimer } from '../hooks/useQuizTimer';

interface SurvivalQuizScreenProps {
  question: Question;
  onAnswer: (isCorrect: boolean, timeLeft: number) => void;
  onExit: () => void;
  wave: number;
  lives: number;
  score: number;
  isSoundEnabled: boolean;
}

const TIME_LIMIT = 15;

const buttonGradients = [
  'btn-gradient-orange',
  'btn-gradient-cyan',
  'btn-gradient-purple',
  'btn-gradient-pink',
];

const SurvivalQuizScreen: React.FC<SurvivalQuizScreenProps> = ({ question, onAnswer, onExit, wave, lives, score, isSoundEnabled }) => {
  const { t } = useLanguage();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleTimeUp = useCallback(() => {
    handleSelectAnswer('', true);
  }, []);

  const { timeLeft, reset } = useQuizTimer({ duration: TIME_LIMIT, onTimeUp: handleTimeUp });
  
  useEffect(() => {
    setSelectedAnswer(null);
    reset();
  }, [question, reset]);

  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0 && selectedAnswer === null) {
      playSound('tick', isSoundEnabled);
    }
  }, [timeLeft, selectedAnswer, isSoundEnabled]);
  
  const handleSelectAnswer = (option: string, timedOut = false) => {
    if (selectedAnswer !== null) return;

    const isCorrect = !timedOut && option === question.answer;
    playSound(isCorrect ? 'correct' : 'incorrect', isSoundEnabled);
    setSelectedAnswer(option);
    onAnswer(isCorrect, timeLeft);
  };

  const timerProgress = (timeLeft / TIME_LIMIT) * 100;

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-slate-900 to-red-900/50 text-white p-4 animate-fade-in">
        <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-2 flex-shrink-0">
            <div className="w-1/3">
                <button onClick={onExit} className="p-2 text-slate-400 rounded-full hover:bg-slate-700/50">
                    <ExitIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="w-1/3 text-center">
                <p className="font-bold text-xl">{t('wave')} {wave}</p>
            </div>
            <div className="w-1/3 flex justify-end items-center gap-2">
                {[...Array(3)].map((_, i) => (
                    <HeartIcon 
                        key={i} 
                        className={`w-7 h-7 transition-all duration-300 ${i < lives ? 'text-red-500 fill-red-500' : 'text-slate-600'}`}
                    />
                ))}
            </div>
        </header>

        <div className="w-full max-w-lg mx-auto bg-slate-700/50 rounded-full h-1.5 my-3">
            <div 
                className={`h-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-400`}
                style={{ width: `${timerProgress}%`, transition: 'width 1s linear' }}
            ></div>
        </div>

        <main className="flex-grow flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full max-w-2xl text-center">
                <p className="text-4xl font-bold text-orange-400 mb-8">{score}</p>

                <h2 className="text-2xl md:text-3xl font-semibold mb-8 px-4">{question.question}</h2>

                <div className="grid grid-cols-2 gap-4">
                    {question.options.map((option, index) => {
                        const hasSelected = selectedAnswer !== null;
                        const isCorrect = option === question.answer;
                        const isSelected = option === selectedAnswer;

                        let buttonClass = '';
                        if (hasSelected) {
                            if (isCorrect) {
                                buttonClass = 'bg-green-500 ring-2 ring-white/50 scale-105';
                            } else if (isSelected) {
                                buttonClass = 'bg-red-600 scale-95';
                            } else {
                                buttonClass = 'bg-slate-700 opacity-50 scale-95';
                            }
                        } else {
                            buttonClass = `${buttonGradients[index]} transform hover:scale-105`;
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleSelectAnswer(option)}
                                disabled={hasSelected}
                                className={`w-full p-4 rounded-xl text-center text-lg font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed ${buttonClass}`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
        </main>
    </div>
  );
};

export default SurvivalQuizScreen;
