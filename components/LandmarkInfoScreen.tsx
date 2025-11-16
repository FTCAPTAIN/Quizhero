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
    <div className="flex flex-col h-full w-full text-white p-4 md:p-8 overflow-y-auto animate-fade-in">
      <header className="w-full max-w-4xl mx-auto flex-shrink-0 pt-16 md:pt-4 mb-8 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 mr-4 text-slate-300 hover:text-white" aria-label="Go back">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-3xl md:text-4xl font-bold">{t('learn_more')}</h1>
      </header>
      
      <main className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Image */}
          <div className="w-full animate-fade-in-down">
            <div className="bg-slate-800/50 p-2 rounded-2xl shadow-lg border border-slate-700">
                 <img src={landmark.imageUrl} alt={landmark.name} className="w-full aspect-square object-cover rounded-xl" />
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="w-full flex flex-col animate-fade-in-down" style={{animationDelay: '100ms'}}>
            <h2 className="text-3xl font-bold mb-1">{landmark.name}</h2>
            <p className="text-md text-slate-400 mb-6">{landmark.hint}</p>
            
            <p className="text-slate-300 mt-2">{landmark.description}</p>

            <div className="space-y-3 mt-6 w-full">
              {landmark.details?.map((detail, index) => (
                <div key={index} className="bg-slate-800/70 p-4 rounded-xl flex justify-between items-center text-left">
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
        </div>
      </main>
    </div>
  );
};

export default LandmarkInfoScreen;
