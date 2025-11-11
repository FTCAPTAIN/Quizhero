import React from 'react';
import { ArrowLeftIcon } from './Icons';
import { LandmarkQuestion } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LandmarkInfoScreenProps {
  landmark: LandmarkQuestion;
  onStartQuiz: () => void;
  onBack: () => void;
}

const LandmarkInfoScreen: React.FC<LandmarkInfoScreenProps> = ({ landmark, onStartQuiz, onBack }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full w-full bg-stars text-white p-4 overflow-y-auto animate-fade-in">
      <header className="w-full max-w-md mx-auto flex-shrink-0 pt-16 md:pt-4">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-300 hover:text-white" aria-label="Go back">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Learn More</h1>

          <div className="relative p-1 rounded-2xl" style={{ backgroundImage: 'linear-gradient(135deg, #22d3ee, #f97316)' }}>
            <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-400 to-orange-400 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-black rounded-[14px] p-2">
                 <img src={landmark.imageUrl} alt={landmark.name} className="w-full aspect-square object-cover rounded-xl" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-center mt-6">{landmark.name} | Learn & Quiz</h2>

          <div className="space-y-3 mt-6 w-full">
            {landmark.details?.map((detail, index) => (
              <div key={index} className="bg-slate-800/70 p-4 rounded-xl flex justify-between items-center">
                <span className="font-semibold text-slate-400">{detail.label}</span>
                <span className="font-bold text-right whitespace-pre-line">{detail.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onStartQuiz}
            className="w-full mt-8 btn-gradient-orange-blue text-white font-bold py-4 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-xl"
          >
            Start Quiz
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandmarkInfoScreen;
