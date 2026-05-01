import { RefreshCw, Trophy, UserMinus, X } from 'lucide-react';

export function WinnerModal({ winner, onClose, onRemoveWinner, onSpinAgain }) {
  if (!winner) return null;

  const winnerName = typeof winner === 'string' ? winner : winner.name;

  return (
    <div className="modal-root" role="dialog" aria-modal="true" aria-labelledby="winner-title">
      <button
        type="button"
        className="modal-backdrop"
        onClick={onClose}
        aria-label="Close winner modal"
      />

      <div className="winner-card">
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="winner-icon">
          <Trophy size={42} />
        </div>

        <p className="eyebrow">Selected</p>
        <h2 id="winner-title">{winnerName}</h2>

        <div className="modal-actions">
          <button type="button" onClick={onSpinAgain} className="modal-primary">
            <RefreshCw size={18} />
            Spin again
          </button>
          <button type="button" onClick={onRemoveWinner} className="modal-danger">
            <UserMinus size={18} />
            Remove name
          </button>
          <button type="button" onClick={onClose} className="modal-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
