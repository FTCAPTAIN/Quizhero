import React, { useState } from 'react';
import type { Answer, Question } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircleIcon, XCircleIcon, SparklesIcon, LightBulbIcon } from './Icons';
import ToggleSwitch from './ToggleSwitch';
import { getGeminiClient } from '../lib/gemini';

interface ResultsScreenProps {
  score: number;
  answers: Answer[];
  questions: Question[];
  onPlayAgain: () => void;
  onGoHome: () => void;
  onShowAnalysis: () => void;
  isAiEnabled: boolean;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, answers, questions, onPlayAgain, onGoHome, onShowAnalysis, isAiEnabled }) => {
  const { t } = useLanguage();
  const correctAnswersCount = answers.filter(a => a.isCorrect).length;
  const totalQuestions = questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 0;
  
  const [explanations, setExplanations] = useState<Record<number, string>>({});
  const [loadingExplanations, setLoadingExplanations] = useState<Record<number, boolean>>({});
  const [showIncorrectOnly, setShowIncorrectOnly] = useState(false);

  const getPerformanceMessage = () => {
    if (accuracy === 100) return t('results_perfect');
    if (accuracy >= 80) return t('results_excellent');
    if (accuracy >= 50) return t('results_good');
    return t('results_can_improve');
  };

  const handleGetExplanation = async (index: number) => {
    const question = questions[index];
    const answer = answers.find(a => a.question.question === question.question);

    if (!answer || loadingExplanations[index] || explanations[index]) {
      return;
    }

    setLoadingExplanations(prev => ({ ...prev, [index]: true }));

    try {
      const ai = getGeminiClient();
      const prompt = `
        Explain the answer to this quiz question in a simple and educational way for a quiz app user.
        Question: "${question.question}"
        The correct answer is "${question.answer}".
        
        Please provide a concise (2-3 sentences) explanation for why "${question.answer}" is the correct answer.
      `;
      
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
      });

      setExplanations(prev => ({ ...prev, [index]: response.text }));
    } catch (err) {
      console.error("AI Explanation Error:", err);
      setExplanations(prev => ({ ...prev, [index]: t('ai_explanations_error') }));
    } finally {
      setLoadingExplanations(prev => ({ ...prev, [index]: false }));
    }
  };
  
  const incorrectAnswers = answers.filter(a => !a.isCorrect);
  const displayedAnswers = showIncorrectOnly ? incorrectAnswers : answers;

  return (
    <div className="flex flex-col h-full w-full animate-fade-in p-4 md:p-6 overflow-y-auto pt-16 md:pt-6">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-slate-600 dark:text-gray-400">{getPerformanceMessage()}</h1>
        <p className="text-7xl font-bold text-[var(--accent-color)] my-4">{score}</p>
        <p className="text-lg text-slate-500 dark:text-slate-400">{t('finalScore')}</p>

        <div className="my-8 w-full grid grid-cols-2 gap-4">
            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-gray-400">{t('correctAnswers')}</p>
                <p className="text-3xl font-bold text-green-500 dark:text-green-400">{correctAnswersCount}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-gray-400">{t('accuracy')}</p>
                <p className="text-3xl font-bold text-orange-500 dark:text-orange-400">{accuracy}%</p>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-8">
            <button
                onClick={onPlayAgain}
                className="w-full bg-[var(--accent-color)] text-[var(--accent-color-contrast)] font-bold py-4 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-xl hover:brightness-90"
            >
                {t('playAgain')}
            </button>
            <button
                onClick={onGoHome}
                className="w-full bg-slate-600 dark:bg-slate-700 hover:bg-slate-500 dark:hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-xl"
            >
                {t('backToHome')}
            </button>
        </div>

        {isAiEnabled && (
          <div className="w-full max-w-md space-y-3">
            <button 
              onClick={onShowAnalysis}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>{t('analyze_performance')}</span>
            </button>
          </div>
        )}

        <div className="w-full mt-10 text-left">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('questionReview')}</h2>
                {incorrectAnswers.length > 0 && (
                    <div className="flex items-center space-x-2">
                        <label htmlFor="incorrect-only" className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('review_incorrect_only')}</label>
                        <ToggleSwitch
                            checked={showIncorrectOnly}
                            onChange={setShowIncorrectOnly}
                            ariaLabel={t('review_incorrect_only')}
                        />
                    </div>
                )}
            </div>

            {showIncorrectOnly && incorrectAnswers.length === 0 && (
                <div className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 p-4 rounded-lg text-center flex items-center justify-center gap-2">
                    <CheckCircleIcon className="w-6 h-6" />
                    <p className="font-semibold">{t('review_all_correct')}</p>
                </div>
            )}
            
            <div className="space-y-3">
                {displayedAnswers.map((answer, index) => {
                    const originalIndex = questions.findIndex(q => q.question === answer.question.question);

                    return (
                        <div key={originalIndex} className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                            <p className="font-semibold text-slate-800 dark:text-white mb-2">{originalIndex + 1}. {answer.question.question}</p>
                            <div className={`flex items-center text-sm p-2 rounded ${answer.isCorrect ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'}`}>
                                {answer.isCorrect ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : <XCircleIcon className="w-5 h-5 mr-2" />}
                                <span>{t('you_answered')}: {answer.selectedAnswer || t('no_answer')}</span>
                            </div>
                            
                            {!answer.isCorrect && (
                              <div className="flex items-center text-sm p-2 mt-1 rounded bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300">
                                  <span className="font-semibold mr-2">{t('correct_answer')}:</span>
                                  <span>{answer.correctAnswer}</span>
                              </div>
                            )}
                            
                            {isAiEnabled && (
                                <>
                                    {!explanations[originalIndex] && (
                                        <div className="mt-2 flex justify-end">
                                            <button
                                                onClick={() => handleGetExplanation(originalIndex)}
                                                disabled={loadingExplanations[originalIndex]}
                                                className="flex items-center gap-2 text-sm bg-amber-500/10 text-amber-500 font-semibold py-1.5 px-3 rounded-full transition-colors hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <LightBulbIcon className="w-4 h-4" />
                                                {loadingExplanations[originalIndex] ? t('explanation_loading') : t('explain_with_ai')}
                                            </button>
                                        </div>
                                    )}
                                    {loadingExplanations[originalIndex] && (
                                        <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-slate-500 animate-pulse">
                                            {t('explanation_loading')}...
                                        </div>
                                    )}
                                    {explanations[originalIndex] && (
                                        <div className="flex items-start text-sm p-3 mt-2 rounded bg-[var(--accent-color)]/10 text-slate-700 dark:text-slate-300 border-l-4 border-[var(--accent-color)] animate-fade-in-fast">
                                            <LightBulbIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-[var(--accent-color)]" />
                                            <div>
                                                <span className="font-semibold">{t('ai_explanation')}: </span>
                                                <span>{explanations[originalIndex]}</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;