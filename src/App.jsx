import { useCallback, useEffect, useMemo, useState } from 'react';
import { History, RotateCcw, Shuffle } from 'lucide-react';
import { Wheel } from './components/Wheel';
import { NameInput } from './components/NameInput';
import { NameList } from './components/NameList';
import { SpinButton } from './components/SpinButton';
import { WinnerModal } from './components/WinnerModal';
import { useWheel } from './hooks/useWheel';

const STORAGE_KEYS = {
  names: 'random-picker:names',
  history: 'random-picker:history',
};

function readStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function normalizeName(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function uniqueChoices(values) {
  const seen = new Set();
  return values
    .map(normalizeName)
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function App() {
  const [names, setNames] = useState(() => uniqueChoices(readStoredArray(STORAGE_KEYS.names)));
  const [history, setHistory] = useState(() => readStoredArray(STORAGE_KEYS.history).slice(0, 12));
  const { rotation, isSpinning, winner, spin, resetWinner } = useWheel(names);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.names, JSON.stringify(names));
  }, [names]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (!winner) return;

    setHistory((current) => [
      {
        id: `${winner.pickedAt}-${winner.index}`,
        name: winner.name,
        pickedAt: winner.pickedAt,
        poolSize: names.length,
      },
      ...current,
    ].slice(0, 12));
  }, [winner, names.length]);

  const handleAddName = useCallback((name) => {
    const nextName = normalizeName(name);
    if (!nextName) return;

    setNames((current) => (
      current.some((existing) => existing.toLowerCase() === nextName.toLowerCase())
        ? current
        : [...current, nextName]
    ));
  }, []);

  const handleAddMany = useCallback((rawValue) => {
    const incoming = uniqueChoices(rawValue.split(/[\n,;]+/));
    if (incoming.length === 0) return;

    setNames((current) => {
      const existing = new Set(current.map((value) => value.toLowerCase()));
      const additions = incoming.filter((value) => !existing.has(value.toLowerCase()));
      return [...current, ...additions].slice(0, 120);
    });
  }, []);

  const handleRemoveName = useCallback((index) => {
    setNames((current) => current.filter((_, i) => i !== index));
  }, []);

  const handleShuffle = useCallback(() => {
    setNames((current) => (
      current
        .map((value) => ({ value, rank: Math.random() }))
        .sort((a, b) => a.rank - b.rank)
        .map((item) => item.value)
    ));
  }, []);

  const handleClearNames = useCallback(() => {
    resetWinner();
    setNames([]);
  }, [resetWinner]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleSpinAgain = useCallback(() => {
    resetWinner();
    window.setTimeout(spin, 120);
  }, [resetWinner, spin]);

  const handleRemoveWinner = useCallback(() => {
    if (!winner) return;

    setNames((current) => {
      if (current[winner.index] === winner.name) {
        return current.filter((_, index) => index !== winner.index);
      }

      const winnerKey = winner.name.toLowerCase();
      const fallbackIndex = current.findIndex((name) => name.toLowerCase() === winnerKey);
      return fallbackIndex === -1
        ? current
        : current.filter((_, index) => index !== fallbackIndex);
    });

    resetWinner();
  }, [resetWinner, winner]);

  const stats = useMemo(() => {
    const lastPick = history[0]?.name || 'None';
    return [
      { label: 'Choices', value: names.length },
      { label: 'Picks', value: history.length },
      { label: 'Last pick', value: lastPick },
    ];
  }, [history, names.length]);

  return (
    <div className="app-shell">
      <main className="app-frame">
        <header className="topline">
          <div>
            <p className="eyebrow">Random choice wheel</p>
            <h1>Random Picker</h1>
          </div>

          <div className="stat-strip" aria-label="Picker summary">
            {stats.map((item) => (
              <div className="stat-pill" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </header>

        <section className="workbench">
          <aside className="panel setup-panel" aria-label="Choice setup">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Setup</p>
                <h2>Choices</h2>
              </div>
              <div className="count-badge">{names.length}/120</div>
            </div>

            <NameInput
              onAdd={handleAddName}
              onAddMany={handleAddMany}
              disabled={isSpinning}
            />

            <div className="toolbar">
              <button
                type="button"
                className="tool-button"
                onClick={handleShuffle}
                disabled={isSpinning || names.length < 2}
              >
                <Shuffle size={17} />
                Shuffle
              </button>
              <button
                type="button"
                className="tool-button danger"
                onClick={handleClearNames}
                disabled={isSpinning || names.length === 0}
              >
                <RotateCcw size={17} />
                Clear
              </button>
            </div>

            <NameList
              names={names}
              onRemove={handleRemoveName}
              disabled={isSpinning}
            />
          </aside>

          <section className="stage-panel" aria-label="Wheel">
            <div className="wheel-wrap">
              <Wheel names={names} rotation={rotation} isSpinning={isSpinning} />
            </div>

            <div className="spin-panel">
              <SpinButton
                onClick={spin}
                disabled={isSpinning || names.length < 2}
                isSpinning={isSpinning}
              />
            </div>

            <div className="history-panel">
              <div className="history-title">
                <div>
                  <p className="eyebrow">Log</p>
                  <h2>Pick history</h2>
                </div>
                <button
                  type="button"
                  className="icon-button"
                  onClick={handleClearHistory}
                  disabled={history.length === 0}
                  aria-label="Clear pick history"
                  title="Clear pick history"
                >
                  <RotateCcw size={17} />
                </button>
              </div>

              {history.length === 0 ? (
                <div className="empty-history">
                  <History size={20} />
                  <span>No picks yet</span>
                </div>
              ) : (
                <ol className="history-list">
                  {history.map((item) => (
                    <li key={item.id}>
                      <strong>{item.name}</strong>
                      <span>
                        {new Date(item.pickedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' '}
                        from {item.poolSize}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>
        </section>
      </main>

      <WinnerModal
        winner={winner}
        onClose={resetWinner}
        onRemoveWinner={handleRemoveWinner}
        onSpinAgain={handleSpinAgain}
      />
    </div>
  );
}

export default App;
