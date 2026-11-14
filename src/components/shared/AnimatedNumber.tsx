import React, { useEffect, useRef, useState } from 'react';

export interface AnimatedNumberProps {
  value: number;
  durationMs?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  durationMs = 700,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const currentRef = useRef<number>(value);

  useEffect(() => {
    const startValue = currentRef.current;
    const delta = value - startValue;
    if (delta === 0) return;

    let animationFrameId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out-expo approximation
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const nextVal = Math.round(startValue + delta * eased);
      currentRef.current = nextVal;
      setDisplayValue(nextVal);
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value, durationMs]);

  return <span className={className}>{displayValue.toLocaleString('vi-VN')}</span>;
};

export default AnimatedNumber;
