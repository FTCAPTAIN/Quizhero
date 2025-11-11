
import { currentUser } from './api';

const FUNCTIONS_BASE = process.env.FUNCTIONS_BASE || ''; // set in env or vite proxy

export async function fetchNextQuestion(quizId: string) {
  const user = currentUser();
  if (!user) throw new Error('Not authenticated');
  const idToken = await user.getIdToken();

  const res = await fetch(`${FUNCTIONS_BASE}/api/nextQuestion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + idToken
    },
    body: JSON.stringify({ quizId })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error('Failed nextQuestion: ' + txt);
  }
  return res.json(); // { question, remaining }
}
