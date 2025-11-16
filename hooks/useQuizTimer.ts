import { useState, useEffect, useRef, useCallback } from 'react';

interface UseQuizTimerProps {
  duration: number;
  onTimeUp: () => void;
}

/**
 * A reusable hook to manage a countdown timer for quizzes.
 * @param duration The total duration of the timer in seconds.
 * @param onTimeUp Callback function to execute when the timer reaches zero.
 * @returns An object with timeLeft, isPaused, and functions to control the timer.
 */
export const useQuizTimer = ({ duration, onTimeUp }: UseQuizTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(true);
  
  const intervalRef = useRef<number | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp; // Keep the ref updated with the latest callback

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isPaused) {
      clearTimer();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearTimer();
          onTimeUpRef.current();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isPaused, duration, clearTimer]);
  
  // Resets the timer to its initial duration and starts it.
  const reset = useCallback(() => {
    clearTimer();
    setTimeLeft(duration);
    setIsPaused(false);
  }, [duration, clearTimer]);
  
  // Resets the timer and immediately pauses it.
  const resetAndPause = useCallback(() => {
    clearTimer();
    setTimeLeft(duration);
    setIsPaused(true);
  }, [duration, clearTimer]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  return { timeLeft, isPaused, pause, resume, reset, resetAndPause };
};
