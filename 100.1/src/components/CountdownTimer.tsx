import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string;
  onComplete?: () => void;
}

export function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsLive(true);
        if (onComplete) onComplete();
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (isLive) {
    return (
      <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-terra-500 to-terra-600 rounded-full animate-pulse shadow-lg shadow-terra-500/30">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <span className="text-white font-bold text-lg uppercase tracking-wider">Продажбата е активна</span>
      </div>
    );
  }

  if (!timeLeft) return null;

  const timeUnits = [
    { label: 'Дни', value: timeLeft.days },
    { label: 'Часа', value: timeLeft.hours },
    { label: 'Минути', value: timeLeft.minutes },
    { label: 'Секунди', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center space-x-4">
      {timeUnits.map((unit, index) => (
        <div key={unit.label}>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="bg-forest-900/50 border border-forest-700 rounded-xl px-4 py-3 min-w-[80px]">
                <div className="text-3xl md:text-4xl font-bold text-sage-50 tabular-nums">
                  {unit.value.toString().padStart(2, '0')}
                </div>
              </div>
              <div className="text-xs md:text-sm text-sage-400 mt-2 uppercase tracking-wider">
                {unit.label}
              </div>
            </div>
            {index < timeUnits.length - 1 && (
              <div className="text-2xl md:text-3xl text-forest-700 font-bold pb-6">:</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
