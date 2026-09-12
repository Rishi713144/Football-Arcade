import { useState } from 'react';
import { players, shuffle } from '../data/players';
import PlayerCard from '../components/PlayerCard';
import PackBurst from '../three/PackBurst';

const RARITY_WEIGHTS = { Legend: 4, Icon: 12, TOTY: 14, Rare: 32, Gold: 38 };

function weightedPick() {
  const total = players.reduce((sum, p) => sum + RARITY_WEIGHTS[p.rarity] || RARITY_WEIGHTS.Gold, 0);
  let roll = Math.random() * total;
  for (const p of shuffle(players)) {
    roll -= RARITY_WEIGHTS[p.rarity] || RARITY_WEIGHTS.Gold;
    if (roll <= 0) return p;
  }
  return players[0];
}

export default function PackOpening({ packs, usePack }) {
  const [revealed, setRevealed] = useState(null);
  const [pending, setPending] = useState(null);

  function open() {
    if (packs <= 0 || pending) return;
    setPending(weightedPick());
  }

  function finishBurst() {
    if (!pending) return;
    usePack(pending);
    setRevealed(pending);
    setPending(null);
  }

  if (pending) {
    return <PackBurst title="PREMIUM PACK" onDone={finishBurst} />;
  }

  return (
    <div className="mode-body">
      <div className="pack-stage">
        {revealed ? (
          <div className="pack-reveal">
            <PlayerCard player={revealed} size="lg" featured tilt={false} flippable={false} />
            <p className="pack-caption">
              <strong>{revealed.name}</strong> joins your club!
            </p>
            <button className="secondary-button" onClick={() => setRevealed(null)}>Keep opening</button>
          </div>
        ) : (
          <button className="pack-box" onClick={open} disabled={packs <= 0}>
            <span className="pack-shine" />
            <strong>{packs > 0 ? 'OPEN PREMIUM PACK' : 'NO PACKS LEFT'}</strong>
            <em>{packs > 0 ? `${packs} available` : 'Earn packs by winning duels & drafts'}</em>
          </button>
        )}
      </div>
    </div>
  );
}