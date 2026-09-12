import { Component, useEffect, useMemo, useState } from 'react';
import PlayerDNA from './games/PlayerDNA';
import FootballIQ from './games/FootballIQ';
import AttributeDuel from './games/AttributeDuel';
import Draft from './games/Draft';
import PackOpening from './games/PackOpening';
import MyClub from './games/MyClub';
import FootballScene from './three/FootballScene';
import { players } from './data/players';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STORAGE_KEY = 'premier-legends-progress';

const modes = [
  { mark: 'DNA', label: 'Player DNA', type: 'Discovery', copy: 'Six questions. One legendary match revealed as a story card.', game: 'dna' },
  { mark: 'IQ', label: 'Football IQ', type: 'Knowledge', copy: 'Five quiz panels. Every question is on the clock.', game: 'iq' },
  { mark: 'DUEL', label: 'Attribute Duel', type: 'Club match', copy: 'Build a five and battle stat-by-stat through six attributes.', game: 'duel' },
  { mark: 'DRAFT', label: 'Seven-Round Draft', type: 'Squad builder', copy: 'EAFC-style themed rounds, chemistry links and a finish rating.', game: 'draft' },
  { mark: 'PACK', label: 'Pack Opening', type: 'Collect', copy: 'Open premium packs and pull icons into your club.', game: 'packs' },
  { mark: 'CLUB', label: 'My Club', type: 'Collection', copy: 'Your pulled players — flip any card to inspect attributes.', game: 'club' }
];

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function xpNeeded(level) {
  return level * 250;
}

class GameBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err) {
    return { err };
  }
  componentDidCatch(err, info) {
    console.error('Game crashed:', err, info);
  }
  render() {
    if (this.state.err) {
      return (
        <div className="game-crash">
          <p>This game hit a snag{this.state.err.message ? `: ${this.state.err.message}` : ''}.</p>
          <button className="secondary-button" type="button" onClick={() => this.setState({ err: null })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [apiState, setApiState] = useState('connecting');
  const [profile, setProfile] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const [progress, setProgress] = useState(loadProgress);
  const [editingName, setEditingName] = useState(false);

  const displayName = profile?.displayName || progress.name || 'Rookie manager';

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(r => r.json())
      .then(d => setApiState(d.database === 'connected' ? 'online' : 'offline'))
      .catch(() => setApiState('offline'));
  }, []);

  useEffect(() => {
    const pid = localStorage.getItem('premier-legends-profile-id');
    if (!pid) return;
    fetch(`${API_URL}/profile/${pid}`)
      .then(r => (r.ok ? r.json() : null))
      .then(setProfile)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function update(fn) {
    setProgress(prev => {
      const next = fn({ ...prev });
      // level-up loop
      let xp = next.xp || 0;
      let level = next.level || 1;
      while (xp >= xpNeeded(level)) {
        xp -= xpNeeded(level);
        level += 1;
      }
      next.xp = xp;
      next.level = level;
      next.wins = next.wins || 0;
      next.packs = next.packs || 0;
      next.collection = next.collection || {};
      return next;
    });
  }

  const stats = useMemo(() => {
    const collectionTotal = Object.values(progress.collection || {}).reduce((a, b) => a + b, 0);
    return {
      level: progress.level || 1,
      xp: progress.xp || 0,
      packs: progress.packs || 0,
      collection: Object.keys(progress.collection || {}).length,
      collectionTotal,
      wins: progress.wins || 0
    };
  }, [progress]);

  function handleFinish(payload = {}) {
    update(prev => {
      const next = { ...prev };
      next.xp = (next.xp || 0) + (payload.xp || 0);
      next.packs = (next.packs || 0) + (payload.packs || 0);
      if (payload.win) next.wins = (next.wins || 0) + 1;
      return next;
    });
    // best-effort sync to cloud profile
    if (profile?._id) {
      fetch(`${API_URL}/profile/${profile._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp: progress.xp + (payload.xp || 0), level: stats.level, packs: stats.packs + (payload.packs || 0), wins: stats.wins + (payload.win ? 1 : 0) })
      }).catch(() => undefined);
    }
  }

  function usePack(player) {
    update(prev => {
      const next = { ...prev };
      next.packs = Math.max(0, (next.packs || 0) - 1);
      next.collection = next.collection || {};
      next.collection[player.id] = (next.collection[player.id] || 0) + 1;
      return next;
    });
  }

  function rename() {
    const next = window.prompt('Enter your manager name:', displayName);
    if (!next || !next.trim()) return;
    const name = next.trim().slice(0, 24);
    setProgress(prev => ({ ...prev, name }));
    setEditingName(false);
  }

  const levelProgress = Math.min(100, (stats.xp / xpNeeded(stats.level)) * 100);

  function renderGame(gameKey) {
    switch (gameKey) {
      case 'dna': return <PlayerDNA onFinish={handleFinish} />;
      case 'iq': return <FootballIQ onFinish={handleFinish} />;
      case 'duel': return <AttributeDuel onFinish={handleFinish} />;
      case 'draft': return <Draft onFinish={handleFinish} />;
      case 'packs': return <PackOpening packs={stats.packs} usePack={usePack} />;
      case 'club': return <MyClub collection={progress.collection || {}} />;
      default: return null;
    }
  }

  const active = activeMode ? modes.find(m => m.game === activeMode) : null;

  return (
    <main className="app-shell">
      <div className="bg-fx" aria-hidden="true">
        <FootballScene density="full" />
        <span className="orb orb-a" /><span className="orb orb-b" /><span className="orb orb-c" />
        <span className="pitch-lines" />
      </div>

      <header className="hero">
        <span className="eyebrow">Football knowledge. Decisions. Glory.</span>
        <h1>Premier Legends</h1>
        <p>Build your club, test your brain, and draft an all-timer XI.</p>
        <span className={`api-pill ${apiState}`}>{apiState === 'online' ? '☁ Cloud profile synced' : apiState === 'offline' ? '· Local progress saved' : 'Connecting…'}</span>
      </header>

      <section className="club-panel">
        <div className="club-identity">
          <div className="club-crest">PL</div>
          <div>
            <span className="eyebrow">Club room</span>
            <h2>{displayName}</h2>
            <p onClick={editingName ? rename : () => setEditingName(true)} className="rename-hint">{editingName ? 'Click to confirm' : levelProgress >= 100 ? `Level ${stats.level + 1} is ready — keep playing!` : `${xpNeeded(stats.level) - stats.xp} XP to level ${stats.level + 1}`}</p>
          </div>
        </div>
        <div className="xp-bar"><div style={{ width: `${levelProgress}%` }} /></div>
        <div className="stat"><small>LEVEL</small><strong>{stats.level}</strong></div>
        <div className="stat"><small>PACKS</small><strong>{stats.packs}</strong></div>
        <div className="stat"><small>COLLECTION</small><strong>{stats.collection}<em>/{players.length}</em></strong></div>
        <div className="stat"><small>WINS</small><strong>{stats.wins}</strong></div>
        <button className="rebrand-btn" onClick={rename} title="Rename manager">✎ {editingName ? 'Confirm' : 'Name'}</button>
      </section>

      {active ? (
        <section className="game-panel" key={active.game}>
          <div className="game-panel-top">
            <button className="text-button" onClick={() => setActiveMode(null)}>← Back to arcade</button>
          </div>
          <span className="eyebrow">{active.type}</span>
          <h2>{active.label}</h2>
          <p className="muted">{active.copy}</p>
          <GameBoundary key={active.game}>{renderGame(active.game)}</GameBoundary>
        </section>
      ) : (
        <>
          <section className="section-heading">
            <div>
              <span className="eyebrow">The arcade</span>
              <h2>Choose your challenge</h2>
            </div>
            <p>Every mode earns XP. Win duels and finish drafts to earn premium packs.</p>
          </section>
          <section className="mode-grid">
            {modes.map(mode => (
              <article
                className={`mode-card mode-${mode.mark.toLowerCase()}`}
                key={mode.game}
                role="button"
                tabIndex={0}
                onClick={() => setActiveMode(mode.game)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveMode(mode.game); } }}
              >
                <span className="mode-mark">{mode.mark}</span>
                <span className="mode-type">{mode.type}</span>
                <h3>{mode.label}</h3>
                <p>{mode.copy}</p>
                <button className="secondary-button" type="button" onClick={() => setActiveMode(mode.game)}>Open mode</button>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}