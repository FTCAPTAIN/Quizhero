import React from 'react';
import { GameHistoryEntry } from '../types';

interface ScoreHistoryGraphProps {
  gameHistory: GameHistoryEntry[];
}

const ScoreHistoryGraph: React.FC<ScoreHistoryGraphProps> = ({ gameHistory }) => {
  const scores = gameHistory.map(g => g.score).reverse(); // Oldest to newest
  if (scores.length < 2) return null;

  const width = 300;
  const height = 100;
  const padding = 5;

  const maxScore = Math.max(...scores, 0);
  const minScore = Math.min(...scores, 0);
  
  // Handle case where all scores are the same
  const scoreRange = maxScore === minScore ? (maxScore > 0 ? maxScore : 1) : (maxScore - minScore);

  const getX = (index: number) => {
    return (index / (scores.length - 1)) * (width - padding * 2) + padding;
  };

  const getY = (score: number) => {
    return height - padding - ((score - minScore) / scoreRange) * (height - padding * 2);
  };

  const path = scores.map((score, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(score)}`).join(' ');

  const points = scores.map((score, i) => (
    <circle
      key={i}
      cx={getX(i)}
      cy={getY(score)}
      r="2.5"
      fill="white"
      stroke="#0891b2" // cyan-600
      strokeWidth="1.5"
    />
  ));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="score-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <path d={`${path} L ${getX(scores.length - 1)} ${height} L ${getX(0)} ${height} Z`} fill="url(#score-gradient)" />

      {/* Line */}
      <path d={path} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {/* Points */}
      {points}
    </svg>
  );
};

export default ScoreHistoryGraph;
