
import React, { useEffect, useState } from 'react';
import { fetchNextQuestion } from '../lib/nextQuestionApi';
import { submitAttempt } from '../lib/api';
import { playSound } from '../lib/sounds';

export default function QuizPlayer({ quiz, onFinished }: { quiz:any, onFinished?: () => void }) {
  const [question, setQuestion] = useState<any | null>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!quiz) return;
    setIndex(0); setScore(0); setQuestion(null); setRemaining(null);
    loadNext();
  }, [quiz]);

  async function loadNext() {
    setLoading(true);
    try {
      const data = await fetchNextQuestion(quiz.id);
      setQuestion(data.question);
      setRemaining(data.remaining);
      setIndex(i => i + 1);
    } catch (e:any) {
      console.error(e);
      alert('Error fetching next question: '+(e.message||e));
    } finally {
      setLoading(false);
    }
  }

  async function handleAnswer(selectedIndex:number) {
    if (!question) return;
    const correct = question.correct_index;
    if (selectedIndex === correct) {
      setScore(s=>s + (question.points || 1));
      try { playSound('coin'); } catch(e) {}
    }
    // small delay for UX before loading next
    setTimeout(async () => {
      // If no remaining or remaining is 0, finish
      if (remaining !== null && remaining <= 0) {
        // submit attempt
        try {
          await submitAttempt(quiz.id, { score: score + (selectedIndex===correct ? (question.points||1) : 0), total: index+1 });
        } catch (e:any) {
          console.error('submitAttempt error', e);
        }
        onFinished && onFinished();
        return;
      }
      loadNext();
    }, 600);
  }

  if (loading && !question) return <div>Loading...</div>;
  if (!question) return <div>No questions available.</div>;

  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded shadow">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <div>Q #{index}</div>
        <div>Remaining: {remaining}</div>
      </div>
      <div className="text-lg font-medium mb-3">{question.text}</div>
      {question.image_url && <div className="mb-3"><img src={question.image_url} alt="q" className="max-w-full rounded" /></div>}
      <ul className="space-y-2">
        {question.options && question.options.map((opt:string, i:number) => (
          <li key={i}>
            <button onClick={() => handleAnswer(i)} className="w-full text-left px-3 py-2 border rounded">{opt}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
