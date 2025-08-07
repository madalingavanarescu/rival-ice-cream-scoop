import React, { useEffect, useRef, useState } from "react";
import { useAnimate } from "framer-motion";

// Countdown to August 19, 2025 at 10:00 GMT
const COUNTDOWN_FROM = "2025-08-19T10:00:00Z";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export default function ShiftingCountdown() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-800 mb-1">Launch Countdown</h3>
        <p className="text-sm text-neutral-600">August 19, 2025 • 10:00 GMT</p>
      </div>
      <div className="flex w-full items-center bg-transparent">
        <CountdownItem unit="Day" label="Days" />
        <CountdownItem unit="Hour" label="Hours" />
        <CountdownItem unit="Minute" label="Minutes" />
        <CountdownItem unit="Second" label="Seconds" />
      </div>
    </div>
  );
}

interface CountdownItemProps {
  unit: string;
  label: string;
}

function CountdownItem({ unit, label }: CountdownItemProps) {
  const { ref, time } = useTimer(unit);
  // For seconds, ensure two digits (00–59)
  const display = unit === "Second" ? String(time).padStart(2, '0') : time;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 px-2 py-4 md:gap-2 md:py-6">
      <div className="relative w-full overflow-hidden text-center">
        <span
          ref={ref}
          className="block text-xl font-mono font-semibold text-neutral-800 md:text-2xl lg:text-3xl"
        >
          {display}
        </span>
      </div>
      <span className="text-xs font-light text-neutral-500 md:text-sm">
        {label}
      </span>
      <div className="h-px w-full bg-neutral-200 mt-2"></div>
    </div>
  );
}

function useTimer(unit: string) {
  const [ref, animate] = useAnimate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeRef = useRef(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    handleCountdown();
    intervalRef.current = setInterval(handleCountdown, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountdown = async () => {
    const end = new Date(COUNTDOWN_FROM);
    const now = new Date();
    const distance = end.getTime() - now.getTime();

    let newTime = 0;
    switch (unit) {
      case "Day":
        newTime = Math.max(0, Math.floor(distance / DAY));
        break;
      case "Hour":
        newTime = Math.max(0, Math.floor((distance % DAY) / HOUR));
        break;
      case "Minute":
        newTime = Math.max(0, Math.floor((distance % HOUR) / MINUTE));
        break;
      default:
        newTime = Math.max(0, Math.floor((distance % MINUTE) / SECOND));
    }

    if (newTime !== timeRef.current) {
      await animate(
        ref.current,
        { y: ["0%", "-50%"], opacity: [1, 0] },
        { duration: 0.35 }
      );

      timeRef.current = newTime;
      setTime(newTime);

      await animate(
        ref.current,
        { y: ["50%", "0%"], opacity: [0, 1] },
        { duration: 0.35 }
      );
    }
  };

  return { ref, time };
} 