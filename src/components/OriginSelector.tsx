import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import type { OriginTheme } from '../types/profile';

type OriginSelectorProps = {
  origins: OriginTheme[];
};

export function OriginSelector({ origins }: OriginSelectorProps) {
  const [selectedId, setSelectedId] = useState(origins[0]?.id ?? '');

  const selected = useMemo(
    () => origins.find((origin) => origin.id === selectedId) ?? origins[0],
    [origins, selectedId],
  );

  return (
    <article className="card" id="origins">
      <div className="section-head">
        <h3>Developer Origin</h3>
        <p className="subtle">Choose your archetype to flavor your profile.</p>
      </div>
      <div className="origin-grid">
        {origins.map((origin, index) => {
          const cardStyle = {
            '--origin-accent': origin.accent,
            animationDelay: `${index * 75}ms`,
          } as CSSProperties;

          return (
            <button
              className={`origin-card ${selected?.id === origin.id ? 'selected' : ''}`}
              style={cardStyle}
              key={origin.id}
              onClick={() => setSelectedId(origin.id)}
              type="button"
            >
              <h4>{origin.name}</h4>
              <p>{origin.flavor}</p>
              <ul>
                {origin.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
      {selected ? (
        <div className="origin-preview" aria-live="polite">
          <h4>{selected.name}</h4>
          <p>{selected.flavor}</p>
          <p>
            <strong>Perks:</strong> {selected.perks.join(' · ')}
          </p>
        </div>
      ) : null}
    </article>
  );
}
