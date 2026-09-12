import { useMemo, useState } from 'react';
import { dnaQuestions } from '../data/quizBank';
import { players } from '../data/players';
import PlayerCard from '../components/PlayerCard';

function findBestMatch(userTraits) {
  const numQuestions = dnaQuestions.length;
  const uPower = userTraits.power / numQuestions;
  const uFlair = userTraits.flair / numQuestions;
  const uLead = userTraits.leadership / numQuestions;
  const uTeam = userTraits.teamwork / numQuestions;

  const scored = players.map(p => {
    const distance =
      Math.abs(p.traits.power - uPower) +
      Math.abs(p.traits.flair - uFlair) +
      Math.abs(p.traits.leadership - uLead) +
      Math.abs(p.traits.teamwork - uTeam);
    return { player: p, distance };
  }).sort((a, b) => a.distance - b.distance);

  const top = scored.slice(0, 3);
  const best = top[0];
  const valid = top.filter(c => c.distance <= best.distance + 1.1);
  const pick = valid[Math.floor(Math.random() * valid.length)];
  const percent = Math.round(Math.max(62, 96 - pick.distance * 9));
  return { player: pick.player, percent };
}

const TRAIT_META = [
  { key: 'power', label: 'Power', short: 'PO' },
  { key: 'flair', label: 'Flair', short: 'FL' },
  { key: 'leadership', label: 'Leadership', short: 'LD' },
  { key: 'teamwork', label: 'Teamwork', short: 'TW' }
];

const RADAR_AXES = [
  { key: 'leadership', label: 'Leadership', short: 'LEA' },
  { key: 'teamwork', label: 'Teamwork', short: 'TEA' },
  { key: 'power', label: 'Power', short: 'POW' },
  { key: 'flair', label: 'Flair', short: 'FLA' }
];

function styleDescriptor(avg) {
  const sorted = [...RADAR_AXES].sort((a, b) => avg[b.key] - avg[a.key]);
  const top = sorted[0];
  const lead = avg[sorted[0].key] - avg[sorted[3].key];
  if (lead < 0.4) return 'Complete All-Rounder';
  const map = { leadership: 'Born Captain', teamwork: 'System Player', power: 'Strength Core', flair: 'Creative Spark' };
  return map[top.key];
}

function dnaCode(avg) {
  const parts = RADAR_AXES.map(a => `${a.short.slice(0, 2)}${Math.max(0, Math.round(avg[a.key]))}`).join('-');
  return `PL-${parts}`;
}

function Radar({ values }) {
  const c = 60;
  const r = 48;
  const norm = key => Math.max(0.04, Math.min(1, values[key] / 3));
  const pts = RADAR_AXES.map((a, i) => {
    const ang = -Math.PI / 2 + (i * Math.PI * 2) / RADAR_AXES.length;
    const v = norm(a.key);
    return [c + Math.cos(ang) * r * v, c + Math.sin(ang) * r * v];
  });
  const poly = pts.map(p => p.join(',')).join(' ');
  const axes = RADAR_AXES.map((a, i) => {
    const ang = -Math.PI / 2 + (i * Math.PI * 2) / RADAR_AXES.length;
    return { x: c + Math.cos(ang) * r, y: c + Math.sin(ang) * r, ...a };
  });
  return (
    <svg viewBox="0 0 120 120" className="dna-radar" role="img" aria-label="Trait radar">
      {[0.33, 0.66, 1].map(g => (
        <polygon key={g} points={axes.map(a => {
          const ang = Math.atan2(a.y - c, a.x - c);
          return `${c + Math.cos(ang) * r * g},${c + Math.sin(ang) * r * g}`;
        }).join(' ')} className="radar-grid" />
      ))}
      {axes.map(a => <line key={a.short} x1={c} y1={c} x2={a.x} y2={a.y} className="radar-axis" />)}
      <polygon points={poly} className="radar-fill" />
      {axes.map((a, i) => (
        <g key={a.short}>
          <text x={c + Math.cos(Math.atan2(a.y - c, a.x - c)) * (r + 8)} y={c + Math.sin(Math.atan2(a.y - c, a.x - c)) * (r + 8)} className="radar-label">{a.short}</text>
          <circle cx={pts[i][0]} cy={pts[i][1]} r="2" className="radar-dot" />
        </g>
      ))}
    </svg>
  );
}

export default function PlayerDNA({ onFinish }) {
  const [step, setStep] = useState(0);
  const [traits, setTraits] = useState({ power: 0, flair: 0, leadership: 0, teamwork: 0 });
  const [result, setResult] = useState(null);
  const [picked, setPicked] = useState(null);

  const questions = useMemo(() => [...dnaQuestions].sort(() => Math.random() - 0.5), []);

  function choose(optionTraits) {
    const next = { ...traits };
    for (const key in optionTraits) next[key] += optionTraits[key];
    setTraits(next);
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      const match = findBestMatch(next);
      setResult(match);
      setPicked(null);
    }
  }

  function confirmMatch() {
    onFinish({ xp: 100 });
    setPicked(true);
  }

  if (result) {
    const avg = {};
    for (const key of RADAR_AXES.map(a => a.key)) avg[key] = traits[key] / questions.length;
    const descriptor = styleDescriptor(avg);
    const code = dnaCode(avg);
    return (
      <div className="mode-body">
        <div className="reveal-stage">
          <PlayerCard player={result.player} size="lg" featured className={picked ? 'is-confirmed' : 'is-revealed'} onClick={picked ? undefined : confirmMatch} actionLabel="Confirm — that's my DNA!" />
          {!picked && <button className="primary-button reveal-cta" onClick={confirmMatch}>Confirm — that&apos;s my DNA!</button>}
        </div>
        <div className="dna-report">
          <span className="eyebrow">DNA Match</span>
          <h3>{result.player.name} — {result.percent}% similar</h3>
          <p className="muted">{result.player.line}</p>

          <div className="dna-fingerprint">
            <Radar values={avg} />
            <div className="dna-fingerprint-meta">
              <span className="dna-style">{descriptor}</span>
              <code className="dna-code">{code}</code>
              <p className="muted">Six questions translated into a fingerprint that lines up with {result.player.name}&apos;s own.</p>
            </div>
          </div>

          <div className="dna-traits">
            {TRAIT_META.map(({ key, label }) => {
              const userVal = Math.round((traits[key] / questions.length) * 3);
              const playerVal = result.player.traits[key];
              return (
                <div className="dna-trait" key={key}>
                  <span>{label} <em>vs {result.player.name}</em></span>
                  <div className="dna-track">
                    <div className="dna-fill" style={{ width: `${(userVal / 3) * 100}%` }} />
                  </div>
                  <div className="dna-track dna-track-player">
                    <div className="dna-fill-alt" style={{ width: `${(playerVal / 3) * 100}%` }} />
                  </div>
                  <strong>{userVal}/3</strong>
                </div>
              );
            })}
          </div>
          {picked && (
            <div className="dna-achievements">
              {result.player.achievements.map(a => <span className="chip" key={a}>{a}</span>)}
            </div>
          )}
          <button className="secondary-button" onClick={() => { setStep(0); setTraits({ power: 0, flair: 0, leadership: 0, teamwork: 0 }); setResult(null); }}>
            ↻ Analyse again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[step];
  return (
    <div className="mode-body">
      <div className="mini-progress">
        {questions.map((_, i) => <span key={i} className={i < step ? 'done' : i === step ? 'active' : ''} />)}
      </div>
      <div className="dna-question">
        <span className="eyebrow">Question {step + 1} / {questions.length}</span>
        <h3>{question.q}</h3>
      </div>
      <div className="choice-grid">
        {question.options.map((opt, i) => (
          <button key={opt.text} className="choice-button dna-answer" onClick={() => choose(opt.traits)}>
            <span className="dna-letter">{String.fromCharCode(65 + i)}</span>
            <span>{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}