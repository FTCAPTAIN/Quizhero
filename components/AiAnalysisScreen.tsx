import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Answer, Question, Difficulty } from '../types';
import { ArrowLeftIcon, SparklesIcon } from './Icons';
import { getGeminiClient } from '../lib/gemini';

interface AiAnalysisScreenProps {
  results: {
    score: number;
    answers: Answer[];
    questions: Question[];
    difficulty: Difficulty;
  };
  onBack: () => void;
}

const AiAnalysisScreen: React.FC<AiAnalysisScreenProps> = ({ results, onBack }) => {
  const { t } = useLanguage();
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const ai = getGeminiClient();

        const simplifiedResults = results.answers.map(a => ({
          question: a.question.question,
          userAnswer: a.selectedAnswer,
          correctAnswer: a.correctAnswer,
          isCorrect: a.isCorrect,
        }));

        const prompt = `
          Analyze a user's quiz performance.
          - Quiz Difficulty: ${results.difficulty}
          - Final Score: ${results.score}
          - Total Questions: ${results.questions.length}
          - Correct Answers: ${results.answers.filter(a => a.isCorrect).length}

          Here are the user's answers:
          ${JSON.stringify(simplifiedResults, null, 2)}

          Provide a brief, encouraging, and insightful analysis in Markdown format. Address the user directly.
          1. Start with a positive, one-sentence summary of their performance.
          2. Identify one or two topics or question types where they did well.
          3. Gently point out one area where they could improve, based on incorrect answers.
          4. Conclude with a motivational sentence.
          Keep the entire analysis under 100 words.
        `;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        setAnalysis(response.text);

      } catch (err) {
        console.error("AI Analysis Error:", err);
        setError("Sorry, the AI analysis couldn't be generated at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    getAnalysis();
  }, [results]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <SparklesIcon className="w-12 h-12 text-[var(--accent-color)] animate-pulse mb-4" />
          <p className="text-lg text-slate-300">Gemini is analyzing your performance...</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-400">{error}</p>;
    }
    return (
      <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 max-w-none">
        {analysis.split('\n').map((line, i) => {
            if (line.startsWith('#')) {
                return <h3 key={i} className="font-bold text-white">{line.replace(/#/g, '')}</h3>
            }
            // Filter out empty lines from the response
            if (line.trim() === '') return null;
            return <p key={i}>{line}</p>
        })}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-full w-full p-4 md:p-6 text-white overflow-y-auto animate-fade-in">
      <header className="w-full max-w-2xl mx-auto pt-16 md:pt-4 mb-8 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 mr-2 text-slate-300 hover:text-white" aria-label="Go back">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
            <SparklesIcon className="w-8 h-8 text-[var(--accent-color)]"/>
            {t('analyze_performance')}
        </h1>
      </header>
      
      <div className="w-full max-w-2xl mx-auto bg-slate-800/50 p-6 rounded-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default AiAnalysisScreen;