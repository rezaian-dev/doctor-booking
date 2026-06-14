import { useCallback, useEffect, useState } from 'react';

// ⏱️ Pad to 2 digits (5 → "05")
const pad = (n: number) => String(n).padStart(2, '0');

interface UseCountdownReturn {
  timeLeft: number;
  isFinished: boolean;
  restart: () => void;
  formattedTime: string;
}

export function useCountdown(initialSeconds = 90): UseCountdownReturn {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  // ⏳ Tick down once per second; self-stops at zero (no state-set in effect body)
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  // 🔄 Reset to initial value
  const restart = useCallback(() => setTimeLeft(initialSeconds), [initialSeconds]);

  return {
    timeLeft,
    isFinished: timeLeft <= 0, // 🎯 derived — no redundant state
    restart,
    formattedTime: `${pad(Math.floor(timeLeft / 60))}:${pad(timeLeft % 60)}`,
  };
}
