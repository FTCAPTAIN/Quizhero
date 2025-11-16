
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
// FIX: Corrected import paths for root-level file.
import type { Question, Difficulty } from './types';
import QuestionCard from './components/QuestionCard';
import Timer from './components/Timer';
import { ExitIcon, LightBulbIcon } from './components/Icons';
import { useLanguage } from './context/LanguageContext';
import { playSound } from './lib/audioUtils';
import { getGeminiClient } from './lib/gemini';
import { useQuizTimer } from './hooks/useQuizTimer';

const TIME_LIMITS: Record<Difficulty, number> = {
  Easy: 20,
  Medium: 15,
  Hard: 10,
};

interface QuizScreenProps {
  question: Question;
  onAnswer: (isCorrect: boolean, timeLeft: number, selectedOption: string, hintUsed: boolean) => void;
  onNext: () => void;
  questionNumber: number;
  totalQuestions: number;
  difficulty: Difficulty;
  score: number;
  onExit: () => void;
  isAiEnabled: boolean;
  // FIX: Added isSoundEnabled to props to fix playSound calls.
  isSoundEnabled: boolean;
}

// FIX: Refactored component to use useQuizTimer hook and handle sound correctly.
const QuizScreen: React.FC<QuizScreenProps> = ({ question, onAnswer, onNext, questionNumber, totalQuestions, difficulty, score, onExit, isAiEnabled, isSoundEnabled }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const timeLimit = TIME_LIMITS[difficulty];
  const nextQuestionTimeoutRef = useRef<number | null>(null);
  const { t } = useLanguage();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // State for AI Hints
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  
  const handleTimeUp = useCallback(() => {
    if (selectedAnswer === null) {
      // FIX: Added isSoundEnabled argument.
      playSound('incorrect', isSoundEnabled);
      setSelectedAnswer(''); // Mark as answered to show feedback
      onAnswer(false, 0, '', hintUsed);
      nextQuestionTimeoutRef.current = window.setTimeout(onNext, 2000);
    }
  }, [selectedAnswer, onAnswer, onNext, hintUsed, isSoundEnabled]);

  const { timeLeft, isPaused, pause, resume, reset } = useQuizTimer({ duration: timeLimit, onTimeUp: handleTimeUp });

  const shuffledOptions = useMemo(() => {
    return [...question.options].sort(() => Math.random() - 0.5);
  }, [question]);

  useEffect(() => {
    setSelectedAnswer(null);
    setHint(null);
    setIsHintLoading(false);
    setHintUsed(false);
    reset();
    
    if (nextQuestionTimeoutRef.current) {
        window.clearTimeout(nextQuestionTimeoutRef.current);
    }

    return () => {
      if (nextQuestionTimeoutRef.current) {
        window.clearTimeout(nextQuestionTimeoutRef.current);
      }
    };
  }, [question, reset]);

  useEffect(() => {
    if (selectedAnswer !== null || isHintLoading || showExitConfirm) {
      pause();
    } else {
      resume();
    }
  }, [selectedAnswer, isHintLoading, showExitConfirm, pause, resume]);

  useEffect(() => {
    if (!isPaused && timeLeft <= 5 && timeLeft > 0) {
      // FIX: Added isSoundEnabled argument.
      playSound('tick', isSoundEnabled);
    }
  }, [timeLeft, isPaused, isSoundEnabled]);

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer !== null) return;
    const isCorrect = option === question.answer;
    // FIX: Added isSoundEnabled argument.
    playSound(isCorrect ? 'correct' : 'incorrect', isSoundEnabled);
    setSelectedAnswer(option);
    onAnswer(isCorrect, timeLeft, option, hintUsed);

    if (nextQuestionTimeoutRef.current) {
        window.clearTimeout(nextQuestionTimeoutRef.current);
    }
    nextQuestionTimeoutRef.current = window.setTimeout(onNext, 2000);
  };
  
  const handleGetHint = async () => {
    if (!isAiEnabled || hintUsed || selectedAnswer !== null) return;

    setIsHintLoading(true);
    setHintUsed(true);

    try {
      const ai = getGeminiClient();
      const prompt = `Provide a single, short hint for the following multiple-choice quiz question. The hint should guide the user toward the correct answer without giving it away directly. The question's category is "${question.category}" and the difficulty is "${difficulty}". Question: "${question.question}" Options: [${question.options.join(', ')}]. The correct answer is "${question.answer}". Do not mention the correct answer or any of the incorrect options in your hint. The hint must be very subtle.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setHint(response.text);
    } catch (err) {
      console.error("AI Hint Error:", err);
      setHint(t('ai_explanations_error'));
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleExitClick = () => setShowExitConfirm(true);
  const handleConfirmExit = () => onExit();
  const handleCancelExit = () => setShowExitConfirm(false);

  const questionProgressPercentage = totalQuestions > 0 ? (questionNumber / totalQuestions) * 100 : 0;

  return (
    <>
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in-fast">
          <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center animate-pop-in">
            <h2 className="text-2xl font-bold text-white mb-2">{t('exit_quiz_title')}</h2>
            <p className="text-slate-300 mb-6">{t('exit_quiz_confirm')}</p>
            <div className="w-full flex gap-4">
              <button
                onClick={handleCancelExit}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleConfirmExit}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors"
              >
                {t('exit_quiz_yes')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex flex-col h-full w-full animate-fade-in">
        <header className="w-full md:hidden flex items-center justify-between h-16 px-4 shrink-0 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800">
          <button
            className="p-2 border border-slate-500 dark:border-gray-600 rounded-md text-slate-500 dark:text-gray-300"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="text-xl font-bold">Quiz<span className="text-orange-500">Hero</span></h1>
          <div className="w-10" />
        </header>

        <button
          onClick={handleExitClick}
          className="absolute top-20 md:top-6 left-6 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 z-10 p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-gray-700/50"
          aria-label="Exit Quiz"
        >
          <ExitIcon className="w-8 h-8" />
        </button>

        <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 overflow-y-auto">
          <div className="w-full max-w-3xl flex flex-col items-center">
            <div className="mb-4">
              {/* FIX: Corrected Timer component usage to pass correct props. */}
              <Timer timeLeft={timeLeft} duration={timeLimit} />
            </div>

            <div className="w-full max-w-md mb-4 px-4">
              <div className="flex justify-between items-center space-x-4">
                <div className="flex-grow bg-slate-200 dark:bg-gray-800 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${questionProgressPercentage}%`, backgroundColor: 'var(--accent-color)' }}
                  ></div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-[var(--accent-color)] text-md leading-tight">{t('score')}: {score}</p>
                  <p className="text-slate-500 dark:text-gray-400 text-xs leading-tight">{questionNumber}/{totalQuestions}</p>
                </div>
              </div>
            </div>

            {isAiEnabled && (
                <div className="w-full max-w-md mb-4 flex justify-end">
                    <button 
                        onClick={handleGetHint}
                        disabled={hintUsed || selectedAnswer !== null || isHintLoading}
                        className="flex items-center gap-2 text-sm bg-amber-500/10 text-amber-500 font-semibold py-2 px-4 rounded-full transition-colors hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LightBulbIcon className="w-4 h-4" />
                        {isHintLoading ? t('hint_loading') : t('hint')}
                        <span className="text-xs opacity-70">({t('hint_cost')})</span>
                    </button>
                </div>
            )}
            
            <main className="w-full flex-grow flex flex-col items-center justify-center">
              {hint && !isHintLoading && (
                  <div className="w-full max-w-3xl mb-6 p-4 bg-slate-800/50 border-l-4 border-amber-500 rounded-r-lg animate-fade-in-fast">
                      <p className="text-slate-300 flex items-start gap-3">
                          <LightBulbIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="font-semibold">{t('ai_hint')}: </span>
                          <span>{hint}</span>
                      </p>
                  </div>
              )}

              <QuestionCard
                question={question.question}
                options={shuffledOptions}
                onSelectAnswer={handleSelectAnswer}
                selectedAnswer={selectedAnswer}
                correctAnswer={question.answer}
                category={question.category}
              />
            </main>
            
            {/* Placeholder for vertical spacing */}
            <div className="h-16 mt-8" />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizScreen;
