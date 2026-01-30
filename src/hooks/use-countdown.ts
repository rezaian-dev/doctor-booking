import { useState, useEffect, useCallback } from 'react';

interface UseCountdownReturn {
  timeLeft: number;
  isFinished: boolean;
  restart: () => void;
  formattedTime: string;
}

export function useCountdown(initialSeconds: number = 90): UseCountdownReturn {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isFinished, setIsFinished] = useState(false);

  // ⏱️ Auto-decrement timer every second
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 🔄 Reset countdown to initial value
  const restart = useCallback(() => {
    setTimeLeft(initialSeconds);
    setIsFinished(false);
  }, [initialSeconds]);


// Pads a number with a leading zero to always show 2 digits ⏱️
const format = (n: number): string => String(n).padStart(2, "0");

// Convert total seconds into MM:SS format for display 🎯
const formattedTime = `${format(Math.floor(timeLeft / 60))}:${format(timeLeft % 60)}`;

  return { timeLeft, isFinished, restart, formattedTime };
}
