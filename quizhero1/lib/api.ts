/*
 Firebase-backed API (client side) for QuizHero Pro.
 - Auth (email/password)
 - Profiles (avatar upload)
 - Quizzes, Questions (with image upload)
 - Attempts & Leaderboard
 - Analytics basics (attempt count)
 - AI stub: function generateQuestions(topic) -> returns sample questions (placeholder)
*/
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, getDoc, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Auth
export function onAuthChange(cb: (u: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
export async function signup(email: string, password: string) {
  const cr = await createUserWithEmailAndPassword(auth, email, password);
  // create a profile doc
  await setDoc(doc(db, 'profiles', cr.user.uid), { email: cr.user.email, created_at: serverTimestamp() });
  return cr.user;
}
export async function login(email: string, password: string) {
  const cr = await signInWithEmailAndPassword(auth, email, password);
  return cr.user;
}
export async function logout() { await signOut(auth); }
export function currentUser() { return auth.currentUser; }

// Profiles & avatars
export async function uploadAvatar(file: File) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  const path = `avatars/${auth.currentUser.uid}/${Date.now()}_${file.name}`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file);
  const url = await getDownloadURL(ref);
  await setDoc(doc(db, 'profiles', auth.currentUser.uid), { avatar_url: url }, { merge: true });
  return url;
}
export async function getProfile(uid: string) {
  const d = await getDoc(doc(db, 'profiles', uid));
  return d.exists() ? { id: d.id, ...d.data() } : null;
}

// Quizzes
export async function createQuiz(data: { title: string; description?: string }) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  const col = collection(db, 'quizzes');
  const docRef = await addDoc(col, {
    title: data.title,
    description: data.description || '',
    created_by: auth.currentUser.uid,
    created_at: serverTimestamp()
  });
  return { id: docRef.id };
}
export async function listQuizzes() {
  const col = collection(db, 'quizzes');
  const snap = await getDocs(col);
  const items: any[] = [];
  snap.forEach(d => items.push({ id: d.id, ...d.data() }));
  return items;
}

// Questions
export async function addQuestion(quizId: string, q: { text: string; options: string[]; correct_index: number; points?: number; imageFile?: File | null }) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  let imageUrl = null;
  if (q.imageFile) {
    const path = `questions/${quizId}/${Date.now()}_${q.imageFile.name}`;
    const ref = storageRef(storage, path);
    await uploadBytes(ref, q.imageFile);
    imageUrl = await getDownloadURL(ref);
  }
  const col = collection(db, `quizzes/${quizId}/questions`);
  const docRef = await addDoc(col, {
    text: q.text,
    options: q.options,
    correct_index: q.correct_index,
    points: q.points || 1,
    image_url: imageUrl,
    created_at: serverTimestamp()
  });
  return { id: docRef.id };
}
export async function getQuestions(quizId: string) {
  const col = collection(db, `quizzes/${quizId}/questions`);
  const snap = await getDocs(col);
  const items: any[] = [];
  snap.forEach(d => items.push({ id: d.id, ...d.data() }));
  return items;
}

// Attempts & leaderboard
export async function submitAttempt(quizId: string, attempt: { score: number; total: number; duration_seconds?: number }) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  const col = collection(db, `quizzes/${quizId}/attempts`);
  const docRef = await addDoc(col, {
    user_id: auth.currentUser.uid,
    score: attempt.score,
    total: attempt.total,
    duration_seconds: attempt.duration_seconds || null,
    created_at: serverTimestamp()
  });
  // increment analytics
  await addDoc(collection(db, 'analytics'), { type: 'attempt', quiz_id: quizId, user_id: auth.currentUser.uid, created_at: serverTimestamp() });
  return { id: docRef.id };
}
export async function getLeaderboard(quizId: string, limitN = 20) {
  const col = collection(db, `quizzes/${quizId}/attempts`);
  const q = query(col, orderBy('score', 'desc'), limit(limitN));
  const snap = await getDocs(q);
  const items: any[] = [];
  snap.forEach(d => items.push({ id: d.id, ...d.data() }));
  return items;
}

// Analytics
export async function getAnalytics() {
  const col = collection(db, 'analytics');
  const snap = await getDocs(col);
  const items: any[] = [];
  snap.forEach(d => items.push({ id: d.id, ...d.data() }));
  return items;
}

// AI stub (placeholder) - later connect to GPT/Gemini
export async function generateQuestions(topic: string, count = 5) {
  // Placeholder: returns simple templated questions. Replace with an API call to LLM.
  const qs = [];
  for (let i = 0; i < count; i++) {
    qs.push({
      text: `Sample question about ${topic} #${i+1}`,
      options: ['A','B','C','D'],
      correct_index: 0,
      points: 1
    });
  }
  return qs;
}