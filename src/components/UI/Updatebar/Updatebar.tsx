import React, { useState, useEffect, useRef } from 'react';
import './Updatebar.scss';

interface Props {
  interval: number;
  update: () => void;
}

export default function Updatebar({ interval, update }: Props) {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      setProgress(elapsed);

      if (elapsed > interval) {
        update();
        start = null;
      }

      rafId.current = requestAnimationFrame(step);
    };

    rafId.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId.current);
  }, [interval, update]);

  return (
    <div
      style={{ transform: `scaleX(${progress / interval})` }}
      className="air__update-bar"
    />
  );
}
