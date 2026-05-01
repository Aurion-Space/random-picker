import { useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';

export function NameInput({ onAdd, onAddMany, disabled = false }) {
  const [name, setName] = useState('');
  const [bulkValue, setBulkValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    setName('');
  };

  const handleBulkSubmit = () => {
    const trimmed = bulkValue.trim();
    if (!trimmed) return;

    onAddMany(trimmed);
    setBulkValue('');
  };

  return (
    <div className="entry-stack">
      <form onSubmit={handleSubmit} className="choice-form">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Add one choice"
          className="choice-input"
          maxLength={50}
          disabled={disabled}
          aria-label="Choice name"
        />
        <button
          type="submit"
          className="primary-icon-button"
          disabled={disabled || name.trim().length === 0}
          aria-label="Add choice"
          title="Add choice"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="bulk-box">
        <textarea
          value={bulkValue}
          onChange={(event) => setBulkValue(event.target.value)}
          placeholder="Paste choices"
          className="bulk-input"
          rows={4}
          disabled={disabled}
          aria-label="Paste multiple choices"
        />
        <button
          type="button"
          className="tool-button full"
          onClick={handleBulkSubmit}
          disabled={disabled || bulkValue.trim().length === 0}
        >
          <ClipboardList size={17} />
          Add pasted
        </button>
      </div>
    </div>
  );
}
