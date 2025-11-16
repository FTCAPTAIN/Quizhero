import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HomeIcon, SparklesIcon, LeaderboardIcon, GlobeAltIcon, BoltIcon } from './Icons';

interface OnboardingScreenProps {
  onFinish: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const { t } = useLanguage();

  const steps = [
    {
      icon: <img src="/icon.png" alt="QuizHero Logo" className="w-16 h-16" />,
      title: t('onboarding_welcome_title'),
      subtitle: t('onboarding_welcome_subtitle'),
    },
    {
      icon: <HomeIcon className="w-16 h-16 text-teal-400" />,
      title: t('onboarding_classic_title'),
      subtitle: t('onboarding_classic_subtitle'),
    },
    {
      icon: <SparklesIcon className="w-16 h-16 text-purple-400" />,
      title: t('onboarding_ai_title'),
      subtitle: t('onboarding_ai_subtitle'),
    },
    {
      icon: <GlobeAltIcon className="w-16 h-16 text-cyan-400" />,
      title: t('onboarding_landmark_title'),
      subtitle: t('onboarding_landmark_subtitle'),
    },
    {
      icon: <BoltIcon className="w-16 h-16 text-red-400" />,
      title: t('onboarding_survival_title'),
      subtitle: t('onboarding_survival_subtitle'),
    },
    {
      icon: <LeaderboardIcon className="w-16 h-16 text-yellow-400" />,
      title: t('onboarding_leaderboard_title'),
      subtitle: t('onboarding_leaderboard_subtitle'),
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-700 rounded-2xl shadow-2xl p-8 flex flex-col text-center items-center animate-pop-in">
        <div className="mb-6">{currentStep.icon}</div>
        <h2 className="text-3xl font-bold text-white mb-2">{currentStep.title}</h2>
        <p className="text-slate-300 mb-8">{currentStep.subtitle}</p>

        <div className="flex items-center justify-center space-x-3 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === step ? 'bg-[var(--accent-color)] scale-125' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

        <div className="w-full flex gap-4">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              {t('onboarding_back')}
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-[var(--accent-color)] text-[var(--accent-color-contrast)] font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out hover:brightness-90"
          >
            {step === steps.length - 1 ? t('onboarding_finish') : t('onboarding_next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
