import React, { useState, useEffect } from 'react';
import type { LandmarkAnswer, LandmarkQuestion } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { StarIcon, CheckCircleIcon, XCircleIcon } from './Icons';

interface LandmarkResultsScreenProps {
  results: {
    score: number;
    answers: LandmarkAnswer[];
    questions: LandmarkQuestion[];
    level: number;
    stars: number;
  };
  onNextLevel: () => void;
  onReplay: () => void;
  onGoToLevels: () => void;
  isNextLevelUnlocked: boolean;
}

const LandmarkResultsScreen: React.FC<LandmarkResultsScreenProps> = ({ results, onNextLevel, onReplay, onGoToLevels, isNextLevelUnlocked }) => {
  const { t } = useLanguage();
  const { score, answers, questions, level, stars } = results;
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (score === 0) return;
    const duration = 1000;
    const increment = score / (duration / 16); // ~60fps
    let currentScore = 0;

    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
            setDisplayScore(score);
            clearInterval(timer);
        } else {
            setDisplayScore(Math.ceil(currentScore));
        }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);


  return (
    <div className="flex flex-col h-full w-full text-white p-4 animate-fade-in" style={{ background: '#042B38' }}>
        <div className="w-full max-w-2xl mx-auto text-center flex-grow flex flex-col pt-16 md:pt-8">
            <h1 className="text-4xl font-bold">{t('level_complete')}</h1>
            <p className="text-lg text-slate-300 mt-1">{t('level')} {level}</p>
            
            <div className="my-8 flex justify-center items-center gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="opacity-0 animate-pop-in" style={{ animationDelay: `${200 + i * 150}ms` }}>
                        <StarIcon className={`w-16 h-16 transition-colors duration-300 ${i < stars ? 'text-yellow-400' : 'text-slate-700'}`}/>
                    </div>
                ))}
            </div>

            <div className="w-full bg-slate-800/50 p-4 rounded-xl grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-slate-400">{t('xp_earned')}</p>
                    <p className="text-3xl font-bold text-cyan-300">{displayScore} XP</p>
                </div>
                 <div>
                    <p className="text-sm text-slate-400">{t('correctAnswers')}</p>
                    <p className="text-3xl font-bold text-green-400">{answers.filter(a => a.isCorrect).length} / {questions.length}</p>
                </div>
            </div>

            <div className="mt-8 w-full flex flex-col sm:flex-row gap-4">
                <button onClick={onGoToLevels} className="flex-1 py-3 px-6 rounded-full bg-slate-700 hover:bg-slate-600 font-bold text-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">{t('back_to_levels')}</button>
                <button onClick={onReplay} className="flex-1 py-3 px-6 rounded-full bg-slate-600 hover:bg-slate-500 font-bold text-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">{t('replay')}</button>
                {isNextLevelUnlocked && (
                    <button onClick={onNextLevel} className="flex-1 py-3 px-6 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">{t('next_level')}</button>
                )}
            </div>
        </div>
        
        <div className="w-full max-w-2xl mx-auto mt-8 flex-shrink-0">
            <h2 className="text-xl font-semibold mb-4 text-left">{t('learn_more_about_landmarks')}</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {questions.map((q, index) => (
                    <div key={q.id} className="bg-slate-800/50 p-3 rounded-lg text-left flex items-start gap-4 opacity-0 animate-fade-in" style={{ animationDelay: `${800 + index * 50}ms` }}>
                        <img src={q.imageUrl} alt={q.answer} className="w-20 h-20 object-cover rounded-md flex-shrink-0"/>
                        <div>
                            <p className="font-bold">{q.answer}</p>
                            <p className="text-sm text-slate-300">{q.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default LandmarkResultsScreen;