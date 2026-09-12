import { players } from '../data/players';
import PlayerCard from '../components/PlayerCard';

export default function MyClub({ collection }) {
  const owned = Object.entries(collection || {})
    .map(([id, n]) => {
      const player = players.find(p => p.id === id);
      return player ? { player, n } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.player.overall - a.player.overall);

  const totalCards = owned.reduce((sum, x) => sum + x.n, 0);

  return (
    <div className="mode-body">
      <div className="collection-head">
        <span className="eyebrow">My Club</span>
        <h3>{owned.length} unique players · {totalCards} cards · flip any card to inspect attributes</h3>
      </div>

      {owned.length === 0 ? (
        <p className="muted">Your club is empty. Open premium packs in Pack Opening to pull players into it.</p>
      ) : (
        <div className="collection-grid my-club-grid">
          {owned.map(({ player, n }) => (
            <div className="collection-tile" key={player.id}>
              <PlayerCard player={player} size="sm" tilt={false} />
              {n > 1 && <span className="collection-count">×{n}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}