import { useEffect, useRef } from 'react';
import { drawWheel } from '../utils/drawWheel';

export function Wheel({ names, rotation = 0, isSpinning = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    drawWheel(ctx, names, rotation);
  }, [names, rotation]);

  return (
    <div className={isSpinning ? 'wheel-shell spinning' : 'wheel-shell'}>
      <div className="wheel-pointer" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        width={720}
        height={720}
        className="wheel-canvas"
        aria-label="Random picker wheel"
      />
      {names.length === 0 && (
        <div className="wheel-empty">
          <strong>Ready</strong>
          <span>Add choices</span>
        </div>
      )}
    </div>
  );
}
