
import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface QuestionCardProps {
  question: string;
  options: string[];
  onSelectAnswer: (option: string) => void;
  selectedAnswer: string | null;
  correctAnswer: string;
  category: string;
}

const optionColors = [
  'bg-orange-500 hover:bg-orange-600',
  'bg-cyan-400 hover:bg-cyan-500',
  'bg-purple-600 hover:bg-purple-700',
  'bg-green-500 hover:bg-green-600',
];

const getCategoryStyle = (category: string): string => {
    switch (category) {
        case 'GK': return 'text-amber-400';
        case 'Sports': return 'text-orange-500';
        case 'Bollywood': return 'text-pink-400';
        case 'Science': return 'text-sky-400';
        case 'Technology': return 'text-indigo-400';
        case 'History': return 'text-yellow-600';
        case 'Geography': return 'text-green-400';
        case 'CurrentAffairs': return 'text-rose-500';
        default: return 'text-slate-800 dark:text-white';
    }
};


const QuestionCard: React.FC<QuestionCardProps> = ({ question, options, onSelectAnswer, selectedAnswer, correctAnswer, category }) => {
  const categoryStyle = getCategoryStyle(category);

  return (
    <div className="w-full animate-fade-in-fast">
      <h2 className={`text-2xl md:text-4xl font-semibold text-center mb-8 md:mb-12 transition-colors duration-300 ${categoryStyle}`}>{question}</h2>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => {
          const hasSelected = selectedAnswer !== null;
          const isCorrectAnswer = option === correctAnswer;
          const isSelectedAnswer = option === selectedAnswer;

          const getButtonClass = () => {
            if (hasSelected) {
              if (isCorrectAnswer) {
                return 'bg-green-500 scale-105 ring-2 ring-white/50'; // Correct answer gets highlighted
              }
              if (isSelectedAnswer && !isCorrectAnswer) {
                return 'bg-red-600 scale-95'; // Incorrectly selected answer
              }
              return `${optionColors[index].split(' ')[0]} opacity-50 dark:opacity-40 scale-95`; // Other non-selected options
            }
            return `${optionColors[index]} transform hover:scale-105`;
          };

          return (
            <button
              key={index}
              onClick={() => onSelectAnswer(option)}
              disabled={hasSelected}
              className={`w-full p-4 rounded-2xl text-center text-lg font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed ${getButtonClass()}`}
            >
              <span className="flex items-center justify-center gap-2">
                {option}
                {hasSelected && isCorrectAnswer && <CheckCircleIcon className="w-6 h-6" />}
                {hasSelected && isSelectedAnswer && !isCorrectAnswer && <XCircleIcon className="w-6 h-6" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
