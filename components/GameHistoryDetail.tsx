import React from 'react';
import { GameHistoryEntry } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { XCircleIcon, CheckCircleIcon, ExitIcon } from './Icons';

interface GameHistoryDetailProps {
  game: GameHistoryEntry;
  onClose: () => void;
}

const GameHistoryDetail: React.FC<GameHistoryDetailProps> = ({ game, onClose }) => {
  const { t } = useLanguage();

  const topicKey = `category_${game.topic}`;
  const topicDisplay = t(topicKey) === topicKey ? game.topic : t(topicKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in-fast">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <header className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">{t('gameHistory')}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700/50 hover:text-white">
            <ExitIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-4 grid grid-cols-3 gap-3 text-center border-b border-slate-700/50">
            <div>
                <p className="text-xs text-slate-400">{t('topic')}</p>
                <p className="font-semibold text-white truncate">{topicDisplay}</p>
            </div>
            <div>
                <p className="text-xs text-slate-400">{t('score')}</p>
                <p className="font-bold text-xl text-cyan-400">{game.score}</p>
            </div>
             <div>
                <p className="text-xs text-slate-400">{t('accuracy')}</p>
                <p className="font-bold text-xl text-orange-400">{game.totalQuestions > 0 ? Math.round((game.correctAnswers / game.totalQuestions) * 100) : 0}%</p>
            </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {game.answers.map((answer, index) => (
            <div key={index} className="bg-slate-800/50 p-3 rounded-lg text-left">
              <p className="font-semibold text-slate-300 mb-2">{index + 1}. {answer.question.question}</p>
              <div className={`flex items-center text-sm p-2 rounded ${answer.isCorrect ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                {answer.isCorrect ? <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" /> : <XCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />}
                <span>{t('you_answered')}: {answer.selectedAnswer || t('no_answer')}</span>
              </div>
              {!answer.isCorrect && (
                   <div className="flex items-start text-sm p-2 mt-1 rounded bg-slate-700/50 text-slate-300">
                      <span className="font-semibold mr-2 flex-shrink-0">{t('correct_answer')}:</span>
                      <span>{answer.correctAnswer}</span>
                  </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameHistoryDetail;
