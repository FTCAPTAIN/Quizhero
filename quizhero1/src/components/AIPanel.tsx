import React, { useState } from 'react';
import { generateQuestions, addQuestion } from '../lib/api';

export default function AIPanel({ quizId }: any) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<any[]>([]);

  async function handleGenerate() {
    setLoading(true);
    try {
      const qs = await generateQuestions(topic, 5);
      setGenerated(qs);
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally { setLoading(false); }
  }

  async function pushToQuiz() {
    if (!quizId) return alert('Select quiz first');
    for (const q of generated) {
      await addQuestion(quizId, { text: q.text, options: q.options, correct_index: q.correct_index });
    }
    alert('Added generated questions');
    setGenerated([]);
  }

  return (
    <div className="p-3 border rounded">
      <h4 className="font-semibold">AI Question Generator (stub)</h4>
      <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic (e.g., India landmarks)" className="border p-2 w-full" />
      <div className="mt-2 flex gap-2">
        <button onClick={handleGenerate} className="px-3 py-1 bg-green-600 text-white rounded">{loading ? 'Generating...' : 'Generate'}</button>
        <button onClick={pushToQuiz} className="px-3 py-1 bg-blue-600 text-white rounded">Add to quiz</button>
      </div>
      <ul className="mt-2">
        {generated.map((g,i) => <li key={i}>{g.text}</li>)}
      </ul>
    </div>
  );
}