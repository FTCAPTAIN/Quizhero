import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { LandmarkQuestion } from '../types';
import { ArrowLeftIcon, LightBulbIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

const TIME_LIMIT = 15;

interface LandmarkQuizScreenProps {
  level: number;
  question: LandmarkQuestion;
  onAnswer: (isCorrect: boolean, timeLeft: number, selectedOption: string, hintUsed: boolean) => void;
  onNext: () => void;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  onExit: () => void;
}

const buttonGradients = [
  'btn-gradient-orange',
  'btn-gradient-pink',
  'btn-gradient-cyan',
  'btn-gradient-purple',
];

const LandmarkQuizScreen: React.FC<LandmarkQuizScreenProps> = ({
  level,
  question,
  onAnswer,
  onNext,
  questionNumber,
  totalQuestions,
  onExit,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const timeLeftRef = useRef<number>(TIME_LIMIT);
  const { t } = useLanguage();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [hintUsed, setHintUsed] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const shuffledOptions = useMemo(() => {
    return [...question.options].sort(() => Math.random() - 0.5);
  }, [question]);

  const handleNextQuestion = () => {
    setIsFading(true);
    setTimeout(() => {
        onNext();
        setIsFading(false);
    }, 300); // Wait for fade-out to complete
  };

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(''); // Mark as answered to show feedback for timeout
      onAnswer(false, 0, '', hintUsed);
      setTimeout(handleNextQuestion, 2000);
    }
  };

  useEffect(() => {
    setSelectedAnswer(null);
    setTimeLeft(TIME_LIMIT);
    timeLeftRef.current = TIME_LIMIT;
    setHintUsed(false);
    setIsHintVisible(false);
    
    if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
            const newTime = prev - 1;
            timeLeftRef.current = newTime;
            if (newTime <= 0) {
                if(timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
                handleTimeUp();
            }
            return newTime;
        });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
    };
  }, [question]);
  
  useEffect(() => {
      if (selectedAnswer !== null && timerIntervalRef.current) {
          window.clearInterval(timerIntervalRef.current);
      }
  }, [selectedAnswer]);

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer !== null) return;
    const isCorrect = option === question.answer;
    setSelectedAnswer(option);
    onAnswer(isCorrect, timeLeftRef.current, option, hintUsed);

    setTimeout(handleNextQuestion, 2000);
  };
  
  const handleShowHint = () => {
      if (selectedAnswer !== null || isHintVisible) return;
      setHintUsed(true);
      setIsHintVisible(true);
  };

  const handleExitClick = () => setShowExitConfirm(true);
  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    onExit();
  };
  const handleCancelExit = () => setShowExitConfirm(false);
  
  const timerProgress = (timeLeft / TIME_LIMIT) * 100;

  return (
    <>
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in-fast">
          <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center animate-pop-in">
            <h2 className="text-2xl font-bold text-white mb-2">{t('exit_quiz_title')}</h2>
            <p className="text-slate-300 mb-6">{t('exit_quiz_confirm')}</p>
            <div className="w-full flex gap-4">
              <button onClick={handleCancelExit} className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors">{t('cancel')}</button>
              <button onClick={handleConfirmExit} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors">{t('exit_quiz_yes')}</button>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex flex-col h-full w-full bg-stars text-white p-4">
        <header className="w-full max-w-lg mx-auto flex justify-between items-center py-2">
            <button onClick={handleExitClick} className="p-2 text-slate-300 rounded-full hover:bg-slate-700/50" aria-label="Exit Quiz">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div className="text-center">
                <p className="font-semibold text-slate-300">{t('landmark_quiz_title')} | {t('question')} {questionNumber}/{totalQuestions}</p>
            </div>
            <div className="w-10 h-10"></div>
        </header>

        <div className="w-full max-w-lg mx-auto bg-slate-700/50 rounded-full h-1 my-3">
            <div 
                className={`h-1 rounded-full bg-gradient-to-r ${timeLeft <= 5 ? 'from-red-500 to-orange-500' : 'from-cyan-400 to-blue-500'}`}
                style={{ width: `${timerProgress}%`, transition: timeLeft > 0 ? 'width 1s linear' : 'none' }}
            ></div>
        </div>

        <main className={`flex-grow flex flex-col items-center justify-center overflow-hidden transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-full max-w-md flex flex-col items-center">
            
            <div key={question.id} className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl card-glow border-2 border-cyan-500/50 mb-6 p-2 bg-black animate-pop-in">
                <img src={question.imageUrl} alt="Landmark" className="w-full h-full object-cover rounded-xl" />
            </div>
            
            <h2 className="text-lg md:text-xl font-medium text-center text-slate-200 mb-4 px-4">
                {question.question}
            </h2>
            
             <div className="w-full max-w-md mb-4 flex justify-end">
                <button 
                    onClick={handleShowHint}
                    disabled={isHintVisible || selectedAnswer !== null}
                    className="flex items-center gap-2 text-sm bg-amber-500/10 text-amber-500 font-semibold py-2 px-4 rounded-full transition-colors hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LightBulbIcon className="w-4 h-4" />
                    {t('show_country_hint')}
                    <span className="text-xs opacity-70">({t('hint_penalty')})</span>
                </button>
            </div>
            
            {isHintVisible && (
                 <div className="w-full max-w-3xl mb-4 p-3 bg-slate-800/50 border-l-4 border-amber-500 rounded-r-lg animate-fade-in-fast">
                    <p className="text-slate-300 flex items-center justify-center gap-2">
                        <span className="font-semibold">Hint: </span>
                        <span>{question.hint}</span>
                    </p>
                </div>
            )}

            <div className="w-full max-w-md space-y-3">
              {shuffledOptions.map((option, index) => {
                const hasSelected = selectedAnswer !== null;
                const isCorrectAnswer = option === question.answer;
                const isSelectedAnswer = option === selectedAnswer;

                let ringClass = 'ring-transparent';
                let opacityClass = 'opacity-100';

                if (hasSelected) {
                  if (isCorrectAnswer) {
                    ringClass = 'ring-green-400 ring-2';
                  } else if (isSelectedAnswer) {
                    ringClass = 'ring-red-500 ring-2';
                  } else {
                    opacityClass = 'opacity-50';
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={hasSelected}
                    className={`w-full p-4 rounded-xl text-center text-lg font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed transform hover:scale-105 btn-gradient-glow ${buttonGradients[index % buttonGradients.length]} ${ringClass} ${opacityClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default LandmarkQuizScreen;