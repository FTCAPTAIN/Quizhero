import React, { useEffect, useState } from 'react';
import { getQuestions, submitAttempt } from '../lib/api';

export default function QuizPlayer({ quiz, onFinished }: { quiz: any, onFinished?: () => void }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!quiz) return;
    getQuestions(quiz.id).then(setQuestions).catch(console.error);
  }, [quiz]);

  useEffect(() => {
    // reset when quiz changes
    setIndex(0); setScore(0); setSelected(null);
  }, [quiz]);

  async function choose(i: number) {
    if (!questions[index]) return;
    setSelected(i);
    const q = questions[index];
    if (i === q.correct_index) {
      setScore(s => s + (q.points || 1));
    }
    setTimeout(async () => {
      setSelected(null);
      if (index + 1 < questions.length) {
        setIndex(i => i + 1);
      } else {
        // finish
        setLoading(true);
        try {
          await submitAttempt(quiz.id, { score, total: questions.length });
          alert('Finished! Score: ' + score + '/' + questions.length);
          onFinished && onFinished();
        } catch (e: any) {
          alert('Error submitting attempt: ' + e.message);
        } finally {
          setLoading(false);
        }
      }
    }, 700);
  }

  if (!quiz) return null;
  if (questions.length === 0) return <div>No questions in this quiz yet.</div>;

  const q = questions[index];
  return (
    <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 8, maxWidth: 700 }}>
      <div><strong>Q{index+1}:</strong> {q.text}</div>
      {q.image_url && <div style={{ marginTop: 8 }}><img src={q.image_url} alt="q" style={{ maxWidth: 400 }} /></div>}
      <ul style={{ marginTop: 12 }}>
        {q.options.map((opt: string, i: number) => (
          <li key={i} style={{ marginBottom: 6 }}>
            <button disabled={selected !== null} onClick={() => choose(i)} style={{ minWidth: 240 }}>
              {opt}
            </button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 8 }}>Score: {score}</div>
    </div>
  );
}