import { RotateCw } from 'lucide-react';

export function SpinButton({ onClick, disabled, isSpinning = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="spin-button"
    >
      <RotateCw size={24} className={isSpinning ? 'spin-icon active' : 'spin-icon'} />
      <span>{isSpinning ? 'Spinning' : disabled ? 'Need 2 choices' : 'Spin'}</span>
    </button>
  );
}
