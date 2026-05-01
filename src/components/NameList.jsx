import { Trash2 } from 'lucide-react';

export function NameList({ names, onRemove, disabled = false }) {
  if (names.length === 0) {
    return (
      <div className="empty-list">
        <span>No choices yet</span>
      </div>
    );
  }

  return (
    <ul className="choice-list" aria-label="Current choices">
      {names.map((name, index) => (
        <li key={`${name}-${index}`} className="choice-row">
          <span className="choice-index">{String(index + 1).padStart(2, '0')}</span>
          <span className="choice-name">{name}</span>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="remove-button"
            disabled={disabled}
            aria-label={`Remove ${name}`}
            title={`Remove ${name}`}
          >
            <Trash2 size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}
