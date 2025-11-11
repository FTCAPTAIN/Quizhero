
import Tutorial from './components/Tutorial';
import { getProfile, currentUser } from './lib/api';

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import AIPanel from './components/AIPanel';
import QuestionForm from './components/QuestionForm';
import QuizPlayer from './components/QuizPlayer';
import Leaderboard from './components/Leaderboard';
import { onAuthChange, signup, login, logout, listQuizzes, createQuiz, currentUser } from '../lib/api';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [mode, setMode] = useState<'login'|'signup'|'app'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [view, setView] = useState<'list'|'create'|'addQuestions'|'play'|'leaderboard'|'profile'>('list');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(u => {
      setUser(u);
      if (u) { setMode('app'); loadQuizzes(); } else setMode('login');
    });
    
// Tutorial modal state injected by assistant
const [showTutorial, setShowTutorial] = React.useState(false);
React.useEffect(()=>{
  (async ()=>{
    try{
      const u = currentUser();
      if(u){
        const profile = await getProfile(u.uid);
        if(!profile || profile.tutorialShown !== true){
          setShowTutorial(true);
        }
      }
    }catch(e){}
  })();
},[]);

return () => unsub && unsub();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  async function loadQuizzes() {
    const list = await listQuizzes();
    setQuizzes(list);
  }

  async function doSignup() { try { await signup(email, password); setEmail(''); setPassword(''); } catch (e:any){ alert('Signup: '+e.message);} }
  async function doLogin() { try { await login(email, password); setEmail(''); setPassword(''); } catch (e:any){ alert('Login: '+e.message);} }
  async function doCreate() { if (!newTitle) return alert('Enter title'); await createQuiz({ title: newTitle, description: newDesc }); setNewTitle(''); setNewDesc(''); loadQuizzes(); setView('list'); }

  if (mode === 'login' || mode === 'signup') {
    return (
      <div>{showTutorial && <Tutorial onDone={async ()=>{ try{ const u = currentUser(); if(u){ await fetch('/api/markTutorialDone', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ userId: currentUser()?.uid }) }); } }catch(e){} setShowTutorial(false); }} />}\n<div className="container">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">QuizHero — {mode === 'login' ? 'Login' : 'Sign up'}</h1>
          <input className="w-full border p-2 mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border p-2 mb-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div className="flex gap-2">
            {mode==='login' ? (
              <>
                <button onClick={doLogin} className="px-3 py-2 bg-blue-600 text-white rounded">Login</button>
                <button onClick={()=>setMode('signup')} className="px-3 py-2 border rounded">Create account</button>
              </>
            ) : (
              <>
                <button onClick={doSignup} className="px-3 py-2 bg-green-600 text-white rounded">Sign up</button>
                <button onClick={()=>setMode('login')} className="px-3 py-2 border rounded">Back to login</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar user={user} onLogout={()=>logout()} onToggleDark={()=>setDark(d=>!d)} />
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Quizzes</h2>
              <div>
                <button onClick={()=>setView('list')} className="px-3 py-1 border rounded mr-2">List</button>
                <button onClick={()=>setView('create')} className="px-3 py-1 bg-blue-600 text-white rounded">Create</button>
              </div>
            </div>

            {view==='create' && (
              <div>
                <input className="w-full border p-2 mb-2" placeholder="Title" value={newTitle} onChange={e=>setNewTitle(e.target.value)} />
                <input className="w-full border p-2 mb-2" placeholder="Description" value={newDesc} onChange={e=>setNewDesc(e.target.value)} />
                <button onClick={doCreate} className="px-3 py-2 bg-green-600 text-white rounded">Create Quiz</button>
              </div>
            )}

            {view==='list' && (
              <ul>
                {quizzes.map(q=>(
                  <li key={q.id} className="p-2 border-b flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{q.title}</div>
                      <div className="text-sm text-gray-500">{q.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>{ setSelected(q); setView('play'); }} className="px-2 py-1 bg-indigo-600 text-white rounded">Play</button>
                      <button onClick={()=>{ setSelected(q); setView('addQuestions'); }} className="px-2 py-1 border rounded">Add Qs</button>
                      <button onClick={()=>{ setSelected(q); setView('leaderboard'); }} className="px-2 py-1 border rounded">Leaderboard</button>
                    </div>
                  </li>
                ))}
                {quizzes.length===0 && <li className="p-2">No quizzes yet</li>}
              </ul>
            )}

            {view==='addQuestions' && selected && (
              <div>
                <h3 className="font-semibold mb-2">Add questions to {selected.title}</h3>
                <QuestionForm quizId={selected.id} onAdded={()=>{}} />
                <div className="mt-2">
                  <AIPanel quizId={selected.id} />
                </div>
              </div>
            )}

            {view==='play' && selected && (
              <div>
                <h3 className="font-semibold mb-2">Playing: {selected.title}</h3>
                <QuizPlayer quiz={selected} onFinished={()=>{ setView('list'); }} />
              </div>
            )}

            {view==='leaderboard' && selected && (
              <div>
                <h3 className="font-semibold mb-2">Leaderboard: {selected.title}</h3>
                <Leaderboard quizId={selected.id} />
              </div>
            )}

          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
            <Profile />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Extras</h4>
            <button onClick={()=>setView('profile')} className="px-3 py-1 border rounded mr-2">Profile</button>
            <button onClick={()=>logout()} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          </div>
        </div>

      </div>
    </div>
  );
}