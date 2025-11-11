import React, { useState, useEffect } from 'react';
import { CrownIcon, SendIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { Difficulty, AiQuizConfig } from '../types';

interface AiQuizPromptScreenProps {
  onCancel: () => void;
  onCreateQuiz: (prompt: string, numQuestions: number, difficulty: Difficulty) => void;
  initialConfig: AiQuizConfig;
  initialPrompt: string;
}

const difficultyKeys: Difficulty[] = ['Easy', 'Medium', 'Hard'];

const AiQuizPromptScreen: React.FC<AiQuizPromptScreenProps> = ({ onCancel, onCreateQuiz, initialConfig, initialPrompt }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [numQuestions, setNumQuestions] = useState(initialConfig.numQuestions);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialConfig.difficulty);
  const { t } = useLanguage();

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleCreate = () => {
    if (prompt.trim()) {
      onCreateQuiz(prompt.trim(), numQuestions, difficulty);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleCreate();
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center p-4 animate-fade-in text-white">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center">
        
        <header className="w-full flex justify-between items-center px-4 mb-8">
            <CrownIcon className="w-8 h-8 text-yellow-400 opacity-80" />
            <h1 className="text-2xl font-bold">
                Quiz<span className="text-cyan-400">Hero</span> <span className="text-orange-500">India</span>
            </h1>
            <SendIcon className="w-8 h-8 text-blue-400 opacity-80 -rotate-12" />
        </header>

        <main className="w-full flex flex-col items-center">
            <h2 className="text-4xl font-bold tracking-tight">{t('askGeminiTitle')}</h2>
            <p className="text-lg text-gray-400 mt-2">{t('askGeminiSubtitle')}</p>

            <div className="relative w-full my-8">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-lg opacity-60"></div>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('aiPromptPlaceholder')}
                    className="relative w-full h-36 p-4 pr-16 bg-gray-900 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all resize-none text-base"
                    aria-label="Quiz topic prompt"
                />
                <button
                    onClick={handleCreate}
                    disabled={!prompt.trim()}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-[var(--accent-color)] hover:bg-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send prompt"
                >
                    <SendIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="w-full space-y-6">
                <div>
                    <label htmlFor="numQuestions" className="block text-lg font-semibold text-slate-300 mb-3">{t('num_questions')} ({numQuestions})</label>
                    <input
                        id="numQuestions"
                        type="range"
                        min="5"
                        max="20"
                        step="1"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
                        className="w-full"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">{t('chooseDifficulty')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {difficultyKeys.map((diff) => (
                            <button
                                key={diff}
                                onClick={() => setDifficulty(diff)}
                                className={`py-3 px-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                                    difficulty === diff
                                        ? 'bg-[var(--accent-color)] text-[var(--accent-color-contrast)] shadow-lg'
                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                            >
                                {t(`difficulty_${diff}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-gray-500 mt-8">{t('aiPromptHelper')}</p>
        </main>
        
        <footer className="w-full max-w-sm flex gap-4 mt-10">
            <button
                onClick={onCancel}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3.5 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg"
            >
                {t('cancel')}
            </button>
            <button
                onClick={handleCreate}
                disabled={!prompt.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3.5 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {t('createQuiz')}
            </button>
        </footer>

      </div>
    </div>
  );
};

export default AiQuizPromptScreen;