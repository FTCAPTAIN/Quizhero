
import React, { useState } from 'react';

const steps = [
  { title: 'Welcome to QuizHero', text: 'Fast quizzes, earn coins & level up!' },
  { title: 'Play', text: 'Tap Play on any quiz to start. Answer questions to earn XP and coins.' },
  { title: 'Coins & Hints', text: 'Use coins to buy hints. Earn coins by completing quizzes.' },
  { title: 'Daily Streaks', text: 'Claim your daily reward and keep streaks for bonuses.' },
  { title: 'Profiles & Badges', text: 'Level up to unlock badges and new themes.' },
  { title: 'Language', text: 'Switch UI between English, Hindi and Telugu in settings.' }
];

export default function Tutorial({ onDone }: { onDone?: ()=>void }) {
  const [i, setI] = useState(0);
  function next() { if (i+1 < steps.length) setI(i+1); else { onDone && onDone(); } }
  function prev() { if (i>0) setI(i-1); }
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">{steps[i].title}</h2>
      <p className="mb-4">{steps[i].text}</p>
      <div className="flex justify-between">
        <button onClick={prev} disabled={i===0} className="px-3 py-1 border rounded">Back</button>
        <button onClick={next} className="px-3 py-1 bg-blue-600 text-white rounded">{i+1===steps.length ? 'Done' : 'Next'}</button>
      </div>
    </div>
  );
}
