import React from 'react';

export default function Navbar({ user, onLogout, onToggleDark }: any) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-xl font-semibold">QuizHero</div>
      <div className="flex items-center gap-3">
        <button onClick={onToggleDark} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Toggle</button>
        {user ? (
          <>
            <div className="text-sm">{user.email}</div>
            <button onClick={onLogout} className="px-3 py-1 rounded bg-red-500 text-white">Logout</button>
          </>
        ) : null}
      </div>
    </div>
  );
}