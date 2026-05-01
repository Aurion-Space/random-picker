import { useCallback, useEffect, useRef, useState } from 'react';

const SPIN_DURATION_MS = 4400;
const TAU = Math.PI * 2;

function normalizeRadians(angle) {
  return ((angle % TAU) + TAU) % TAU;
}

function randomFloat() {
  if (!crypto?.getRandomValues) return Math.random();

  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0] / 0xffffffff;
}

export function useWheel(names) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const animationRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const resetWinner = useCallback(() => {
    setWinner(null);
  }, []);

  const spin = useCallback(() => {
    if (isSpinning || names.length < 2) return;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsSpinning(true);
    setWinner(null);

    const segmentAngle = TAU / names.length;
    const winnerIndex = Math.floor(randomFloat() * names.length);
    const fullRotations = 6 + Math.floor(randomFloat() * 4);
    const startRotation = rotation;
    const currentRotation = normalizeRadians(startRotation);
    const winningSliceCenter = winnerIndex * segmentAngle + segmentAngle / 2;
    const targetRotationAtPointer = normalizeRadians(-winningSliceCenter);
    const finalOffset = normalizeRadians(targetRotationAtPointer - currentRotation);
    const targetRotation = startRotation + fullRotations * TAU + finalOffset;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / SPIN_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const nextRotation = startRotation + (targetRotation - startRotation) * eased;

      setRotation(nextRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      setIsSpinning(false);
      setWinner({
        name: names[winnerIndex],
        index: winnerIndex,
        pickedAt: new Date().toISOString(),
      });
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isSpinning, names, rotation]);

  return { rotation, isSpinning, winner, spin, resetWinner };
}
