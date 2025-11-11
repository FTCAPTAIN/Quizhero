import React, { useState } from 'react';
import { addQuestion } from '../lib/api';

export default function QuestionForm({ quizId, onAdded }: { quizId: string, onAdded?: () => void }) {
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correct, setCorrect] = useState(0);
  const [points, setPoints] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!text) return alert('Enter question text');
    if (options.some(o => !o)) return alert('Fill all options');
    setLoading(true);
    try {
      await addQuestion(quizId, {
        text,
        options,
        correct_index: correct,
        points,
        imageFile: file
      });
      setText('');
      setOptions(['','','','']);
      setCorrect(0);
      setFile(null);
      onAdded && onAdded();
      alert('Question added');
    } catch (e: any) {
      alert('Error: ' + (e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, maxWidth: 700 }}>
      <h3>Add question</h3>
      <div>
        <textarea placeholder="Question text" value={text} onChange={e => setText(e.target.value)} style={{ width: '100%', minHeight: 60 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
        {options.map((opt, i) => (
          <input key={i} placeholder={`Option ${i+1}`} value={opt} onChange={e => {
            const copy = [...options]; copy[i] = e.target.value; setOptions(copy);
          }} />
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Correct option: </label>
        <select value={correct} onChange={e => setCorrect(Number(e.target.value))}>
          <option value={0}>Option 1</option>
          <option value={1}>Option 2</option>
          <option value={2}>Option 3</option>
          <option value={3}>Option 4</option>
        </select>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Points: </label>
        <input type="number" value={points} onChange={e => setPoints(Number(e.target.value))} style={{ width: 80 }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Image (optional): </label>
        <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={handleAdd} disabled={loading}>{loading ? 'Adding...' : 'Add question'}</button>
      </div>
    </div>
  );
}