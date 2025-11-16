import React from 'react';

interface TimerProps {
  timeLeft: number;
  duration: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, duration }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // Ensure progress is 0 when timeLeft is 0 to avoid a tiny sliver of the line
  const progress = duration > 0 && timeLeft > 0 ? (timeLeft / duration) * circumference : 0;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center text-[var(--accent-color)]">
      <svg className="absolute w-full h-full" viewBox="0 0 140 140">
        {/* Background Circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="transparent"
          className="stroke-slate-200 dark:stroke-[rgba(255,255,255,0.1)]"
          strokeWidth="10"
        />
        {/* Progress Circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.3s linear' }}
        />
      </svg>
      <span className="relative text-7xl font-bold text-slate-800 dark:text-white tracking-tighter" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>
        {timeLeft}
      </span>
    </div>
  );
};

export default Timer;
