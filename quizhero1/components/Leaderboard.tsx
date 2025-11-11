import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../lib/api';

export default function Leaderboard({ quizId }: { quizId: string }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!quizId) return;
    getLeaderboard(quizId).then(setItems).catch(console.error);
  }, [quizId]);

  return (
    <div style={{ maxWidth: 700 }}>
      <h3>Leaderboard</h3>
      <ol>
        {items.map(it => (
          <li key={it.id}>
            <strong>{it.user_id}</strong> — {it.score} / {it.total} <small>on {it.created_at && new Date(it.created_at.seconds ? it.created_at.seconds*1000 : it.created_at).toLocaleString()}</small>
          </li>
        ))}
        {items.length === 0 && <li>No attempts yet</li>}
      </ol>
    </div>
  );
}