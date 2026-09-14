"use client";

import { useState, useEffect, useCallback } from "react";

function getTimeRemaining() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diff = tomorrow.getTime() - now.getTime();

  return {
    days: 0,
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label, size = "md" }) {
  const isSm = size === "sm";
  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-400/30 ${isSm ? "h-9 w-9 sm:h-10 sm:w-10" : "h-12 w-12 sm:h-14 sm:w-14"}`}>
        <span suppressHydrationWarning className={`font-extrabold tabular-nums ${isSm ? "text-sm sm:text-base" : "text-lg sm:text-xl"}`}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className={`mt-1.5 font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 ${isSm ? "text-[8px] sm:text-[9px]" : "text-[10px] sm:text-xs"}`}>
        {label}
      </span>
    </div>
  );
}

function Separator({ size = "md" }) {
  const isSm = size === "sm";
  return (
    <div className={`flex flex-col items-center gap-1.5 ${isSm ? "pb-3.5" : "pb-5"}`}>
      <div className={`rounded-full bg-amber-500 animate-pulse ${isSm ? "size-1" : "size-1.5"}`} />
      <div className={`rounded-full bg-amber-500 animate-pulse ${isSm ? "size-1" : "size-1.5"}`} />
    </div>
  );
}

export default function CountdownTimer({ size = "md" }) {
  const [time, setTime] = useState(getTimeRemaining);

  const tick = useCallback(() => {
    setTime((prev) => {
      if (prev.seconds > 0) {
        return { ...prev, seconds: prev.seconds - 1 };
      }
      if (prev.minutes > 0) {
        return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
      }
      if (prev.hours > 0) {
        return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
      }
      return getTimeRemaining();
    });
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <div className={`flex items-center ${size === "sm" ? "gap-1.5 sm:gap-2 justify-center" : "gap-2 sm:gap-3"}`}>
      <TimeUnit value={time.hours} label="Hours" size={size} />
      <Separator size={size} />
      <TimeUnit value={time.minutes} label="Min" size={size} />
      <Separator size={size} />
      <TimeUnit value={time.seconds} label="Sec" size={size} />
    </div>
  );
}
