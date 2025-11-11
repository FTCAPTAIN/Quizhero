
import React, { useState, useEffect, useRef } from 'react';
import { Match, User, Question, Bot } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import QuestionCard from '../QuestionCard';
import { SwordsIcon, StarIcon } from '../Icons';

interface MultiplayerQuizScreenProps {
    match: Match;
    currentUser: User;
    onMatchUpdate: (match: Match) => void;
    onMatchEnd: (match: Match) => void;
}

const TIME_LIMIT = 15;

const PlayerPanel: React.FC<{ player: User | Bot, score: number, isCurrentUser: boolean }> = ({ player, score, isCurrentUser }) => (
    <div className={`w-full p-3 rounded-lg flex items-center ${isCurrentUser ? 'bg-[var(--accent-color)]/20' : 'bg-slate-800/50'}`}>
        <div className="w-12 h-12 text-3xl rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
           {player.avatar.includes('pravatar') ? (
               <img src={player.avatar} alt={player.name} className="w-full h-full rounded-full" />
           ) : (
                <span>{player.avatar}</span>
           )}
        </div>
        <div className="ml-3 flex-grow">
            <p className="font-bold text-white truncate">{player.name}</p>
            <p className="text-sm text-slate-400">Rating: {player.rating}</p>
        </div>
        <div className="text-right">
            <p className="text-xl font-bold text-white">{score}</p>
        </div>
    </div>
);

const MultiplayerQuizScreen: React.FC<MultiplayerQuizScreenProps> = ({ match, currentUser, onMatchUpdate, onMatchEnd }) => {
    const { t } = useLanguage();
    const [timer, setTimer] = useState(TIME_LIMIT);
    const [userAnswer, setUserAnswer] = useState<string | null>(null);
    const [opponentAnswer, setOpponentAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    
    const opponent = match.players.find(p => p.id !== currentUser.id)!;
    const currentQuestion = match.questions[match.currentQuestionIndex];
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        setTimer(TIME_LIMIT);
        setUserAnswer(null);
        setOpponentAnswer(null);
        setShowResult(false);

        intervalRef.current = window.setInterval(() => {
            setTimer(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Simulate opponent's answer
        const isBot = 'difficulty' in opponent;
        let answerDelay = 4000 + Math.random() * 5000; // Default for human
        let chosenAnswer = currentQuestion.options[Math.floor(Math.random() * currentQuestion.options.length)];

        if (isBot) {
            const botOpponent = opponent as Bot;
            let difficultyMultiplier = 1.0;
            if (currentQuestion.difficulty === 'Medium') difficultyMultiplier = 1.2;
            if (currentQuestion.difficulty === 'Hard') difficultyMultiplier = 1.5;
            
            // Smarter bots are faster, but think longer on harder questions
            answerDelay = (1500 + (1 - botOpponent.accuracy) * 3000) * difficultyMultiplier + Math.random() * 1500;
            
            if (Math.random() < botOpponent.accuracy) {
                chosenAnswer = currentQuestion.answer; // Bot gets it right
            } else {
                // Bot gets it wrong, pick a wrong option
                const wrongOptions = currentQuestion.options.filter(o => o !== currentQuestion.answer);
                chosenAnswer = wrongOptions.length > 0 ? wrongOptions[Math.floor(Math.random() * wrongOptions.length)] : currentQuestion.options[0];
            }
        }
        
        const opponentAnswerTimeout = setTimeout(() => {
            if (!showResult) { // Ensure opponent doesn't answer after question ends
                 setOpponentAnswer(chosenAnswer);
            }
        }, answerDelay);
        
        return () => {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            clearTimeout(opponentAnswerTimeout);
        };
    }, [match.currentQuestionIndex, opponent, currentQuestion, showResult]);

    const handleNextQuestion = () => {
        const nextQuestionIndex = match.currentQuestionIndex + 1;
        if (nextQuestionIndex < match.questions.length) {
            onMatchUpdate({ ...match, currentQuestionIndex: nextQuestionIndex });
        } else {
            const finalMatchState = { ...match, status: 'finished' as const };
            onMatchUpdate(finalMatchState);
            onMatchEnd(finalMatchState);
        }
    };

    useEffect(() => {
        if ((userAnswer !== null && opponentAnswer !== null) || timer <= 0) {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
            if(showResult) return; // Prevent double-triggering

            setShowResult(true);

            let newScores = { ...match.scores };
            if (userAnswer === currentQuestion.answer) {
                newScores[currentUser.id] += (100 + timer * 5);
            }
            if (opponentAnswer === currentQuestion.answer) {
                 newScores[opponent.id] += (100 + (Math.floor(Math.random()*5) * 5)); // simulate opponent speed
            }

            onMatchUpdate({ ...match, scores: newScores });

            setTimeout(handleNextQuestion, 2500);
        }
    }, [userAnswer, opponentAnswer, timer]);

    const handleSelectAnswer = (option: string) => {
        if (userAnswer !== null) return;
        setUserAnswer(option);
    };

    const isMatchFinished = match.status === 'finished';
    const finalUserScore = match.scores[currentUser.id];
    const finalOpponentScore = match.scores[opponent.id];
    let resultText = '';
    let ratingChangeText = '';
    if (isMatchFinished) {
        if (finalUserScore > finalOpponentScore) resultText = t('you_win');
        else if (finalUserScore < finalOpponentScore) resultText = t('you_lose');
        else resultText = t('draw');

        if (match.isRated) {
             const K = 32;
             const expected = 1 / (1 + Math.pow(10, (opponent.rating - currentUser.rating) / 400));
             const actual = finalUserScore > finalOpponentScore ? 1 : finalUserScore < finalOpponentScore ? 0 : 0.5;
             const newRating = Math.round(currentUser.rating + K * (actual - expected));
             const change = newRating - currentUser.rating;
             ratingChangeText = t('rating_change', { oldRating: currentUser.rating, newRating, change: `${change >= 0 ? '+' : ''}${change}` });
        }
    }

    return (
        <div className="relative flex flex-col h-full w-full animate-fade-in p-4 md:p-6 bg-stars">
            {isMatchFinished && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 animate-fade-in">
                    <h2 className="text-6xl font-bold text-cyan-400">{resultText}</h2>
                    <p className="text-2xl mt-2 text-white">{finalUserScore} - {finalOpponentScore}</p>
                    {match.isRated && <p className="text-lg mt-4 text-slate-300">{ratingChangeText}</p>}
                </div>
            )}

            <div className="w-full max-w-4xl mx-auto flex flex-col flex-grow">
                {/* Header: Players & Score */}
                <header className="grid grid-cols-2 gap-4 items-center mb-6">
                    <PlayerPanel player={currentUser} score={match.scores[currentUser.id]} isCurrentUser={true} />
                    <PlayerPanel player={opponent} score={match.scores[opponent.id]} isCurrentUser={false} />
                </header>

                <main className="flex-grow flex flex-col items-center justify-center">
                    {/* Timer & Progress */}
                    <div className="w-full flex justify-center items-center mb-6">
                        <div className="relative w-24 h-24 flex items-center justify-center text-[var(--accent-color)]">
                            <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="8"/>
                                <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 45} strokeDashoffset={(2 * Math.PI * 45) * (1 - timer / TIME_LIMIT)} transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s linear' }}/>
                            </svg>
                            <span className="text-4xl font-bold text-white">{timer}</span>
                        </div>
                    </div>
                    
                    <p className="mb-4 text-slate-400">{match.currentQuestionIndex + 1} / {match.questions.length}</p>

                    {/* Question Card */}
                    <div className="w-full max-w-3xl">
                        <QuestionCard
                          question={currentQuestion.question}
                          options={currentQuestion.options}
                          onSelectAnswer={handleSelectAnswer}
                          selectedAnswer={showResult ? userAnswer : userAnswer}
                          correctAnswer={showResult ? currentQuestion.answer : (userAnswer === currentQuestion.answer ? userAnswer : '')}
                          category={currentQuestion.category}
                        />
                    </div>
                    
                    {/* Opponent Answer Indicator */}
                    <div className="h-8 mt-6 flex items-center justify-center text-sm text-slate-500">
                        {opponentAnswer === null && !showResult && <p className="animate-pulse">{t('waiting_for_opponent')}</p>}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default MultiplayerQuizScreen;
