import { useEffect, useRef, useState } from 'react';
import { RARITIES, STAT_KEYS, STAT_LABELS } from '../data/players';

const TIER_CLASS = {
  Legend: 'fcc-legend',
  Icon: 'fcc-icon',
  TOTY: 'fcc-toty',
  Rare: 'fcc-rare',
  Gold: 'fcc-gold'
};

const HOLO_RARITIES = ['Legend', 'Icon', 'TOTY'];

const TRAIT_LABELS = {
  power: 'POWER',
  flair: 'FLAIR',
  leadership: 'LEADER',
  teamwork: 'CLASS'
};

function initialPair(name) {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function TraitDots({ level }) {
  return (
    <span className="fc-trait-dots">
      {[1, 2, 3].map(i => <span key={i} className={level >= i ? 'on' : ''} />)}
    </span>
  );
}

export default function PlayerCard({
  player,
  size = 'md',
  tilt = true,
  className = '',
  onClick = null,
  actionLabel = 'Select',
  disabled = false,
  flippable = true
}) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});
  const [glare, setGlare] = useState({ x: 50, y: 50, o: 0 });
  const [flipped, setFlipped] = useState(false);
  const [imgState, setImgState] = useState(player.image ? 'loading' : 'none');

  useEffect(() => {
    setImgState(player.image ? 'loading' : 'none');
  }, [player.id, player.image]);

  const tierClass = TIER_CLASS[player.rarity] || TIER_CLASS.Gold;
  const holo = HOLO_RARITIES.includes(player.rarity);
  const st = {
    backgroundImage: `linear-gradient(160deg, ${player.nationColor}22, transparent 70%)`
  };

  function handleMove(e) {
    if (!tilt || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 16;
    const ry = (px - 0.5) * 16;
    setStyle({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`,
      transition: 'transform 80ms linear'
    });
    setGlare({ x: px * 100, y: py * 100, o: 1 });
  }

  function handleLeave() {
    setStyle({ transform: 'perspective(900px) rotateX(0) rotateY(0)', transition: 'transform 500ms ease' });
    setGlare({ x: 50, y: 50, o: 0 });
  }

  function handleFlip(e) {
    e.stopPropagation();
    if (disabled) return;
    if (!flippable) {
      if (onClick) onClick(player);
      return;
    }
    setFlipped(f => !f);
  }

  function handleAction(e) {
    e.stopPropagation();
    if (onClick) onClick(player);
  }

  return (
    <div
      ref={ref}
      className={`fc-card ${tierClass} fc-size-${size} ${holo ? 'fc-holo-on' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleFlip}
      role="button"
      aria-label={player.name}
    >
      <div className={`fc-inner ${flipped ? 'is-flipped' : ''}`}>
        {/* FRONT — pure image */}
        <div className="fc-face fc-front">
          <span className="fc-accent" />
          <div className="fc-fx">
            <div className="fc-mesh" style={st} />
            <div
              className="fc-glare"
              style={{ background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${0.3 * glare.o}), transparent 55%)` }}
            />
            {holo && <span className="fc-holo" />}
            <span className="fc-shine" />
          </div>

          <div className="fc-photo">
            <span className="fc-aura" />
            <span className="fc-photo-initials">{initialPair(player.name)}</span>
            {player.image && imgState !== 'broken' && (
              <img
                key={player.id}
                className={`fc-photo-img ${imgState === 'loaded' ? 'is-loaded' : ''}`}
                src={player.image}
                alt={player.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                onLoad={() => setImgState('loaded')}
                onError={() => setImgState('broken')}
              />
            )}
            <span className="fc-top-shade" />
            <span className="fc-bot-shade" />
          </div>

          <div className="fc-topline">
            <span className="fc-rating-box">
              <strong className="fc-ovr">{player.overall}</strong>
              <span className="fc-ovr-cap">OVR</span>
            </span>
            <span className="fc-rarity">{RARITIES[player.rarity]?.label || player.rarity}</span>
            <span className="fc-pos">{player.position}</span>
          </div>

          <div className={`fc-altpos ${player.alt.length ? '' : 'fc-altpos-none'}`}>
            {player.alt.length ? player.alt.map(p => <span key={p} className="fc-alt-chip">{p}</span>) : <span className="fc-alt-chip">—</span>}
          </div>
          <div className="fc-nameplate">
            <span className="fc-name">{player.name}</span>
            <span className="fc-era">{player.era}</span>
          </div>
          <span className="fc-hint">flip ▸</span>
        </div>

        {/* BACK — attributes & story */}
        <div className="fc-face fc-back">
          <span className="fc-accent" />
          <div className="fc-back-fx" />

          <div className="fc-back-body">
            <div className="fc-back-head">
              <span className="fc-back-ovr">{player.overall}</span>
              <span className="fc-back-title">
                <b>{player.name}</b>
                <em>{player.era}</em>
              </span>
              <span className="fc-back-pos">{player.position}</span>
            </div>

            <div className="fc-back-crests">
              <span title={player.nation}>{player.nation}</span>
              <span title={player.club}>{player.club}</span>
            </div>

            <div className="fc-back-stats">
              {STAT_KEYS.map(key => (
                <div className="fc-back-stat" key={key}>
                  <span className="fc-back-stat-label">{STAT_LABELS[key]}</span>
                  <div className="fc-stat-track">
                    <div className="fc-stat-fill" style={{ width: `${player.stats[key]}%` }} />
                  </div>
                  <span className="fc-back-stat-val">{player.stats[key]}</span>
                </div>
              ))}
            </div>

            {player.traits && (
              <div className="fc-back-traits">
                {Object.entries(TRAIT_LABELS).map(([key, label]) => (
                  <span className="fc-back-trait" key={key}>
                    {label} <TraitDots level={player.traits[key] || 1} />
                  </span>
                ))}
              </div>
            )}

            {player.line && <p className="fc-back-line">“{player.line}”</p>}

            {player.achievements && player.achievements.length > 0 && (
              <ul className="fc-back-ach">
                {player.achievements.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            )}

            {onClick && (
              <button className="fc-back-action" onClick={handleAction}>{actionLabel}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}