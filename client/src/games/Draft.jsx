import { useEffect, useMemo, useRef, useState } from 'react';
import { players, shuffle, squadChemistry, chemistryGrade, effectiveRating, formationFrom } from '../data/players';
import PlayerCard from '../components/PlayerCard';

const ROUND_THEMES = [
  { label: 'Round 1 · Forward Line', match: p => ['ST', 'CF', 'LW', 'RW'].includes(p.position), subtitle: 'Lock in your main man up top.' },
  { label: 'Round 2 · Engine Room', match: p => ['CM', 'CAM', 'CDM', 'RM', 'LM'].includes(p.position), subtitle: 'Who pulls the strings in midfield?' },
  { label: 'Round 3 · Back Line', match: p => ['CB', 'LB', 'RB'].includes(p.position), subtitle: 'Shut the door at the back.' },
  { label: 'Round 4 · Between the Posts', match: p => p.position === 'GK', subtitle: 'Every great team needs a keeper.' },
  { label: 'Round 5 · Young Blood', match: p => p.era === 'Modern Era' && p.overall <= 90, subtitle: 'The next generation of superstars.' },
  { label: 'Round 6 · Icons & Legends', match: p => p.rarity === 'Legend' || p.rarity === 'Icon', subtitle: 'Primetime talent. Unmissable.' },
  { label: 'Round 7 · Captain\'s Elite', match: () => true, subtitle: 'Best players left in the pool.' }
];

function buildDraft() {
  const byId = new Map(players.map(p => [p.id, p]));
  const remaining = shuffle(players).map(p => p.id);
  return ROUND_THEMES.map(theme => {
    const candidates = remaining.filter(id => theme.match(byId.get(id)));
    const take = [];
    for (let k = 0; k < 4; k++) {
      let choice;
      if (candidates.length) choice = candidates.shift();
      else choice = remaining.length ? remaining.shift() : undefined;
      if (!choice) break;
      const ix = remaining.indexOf(choice);
      if (ix >= 0) remaining.splice(ix, 1);
      take.push({ ...byId.get(choice) });
    }
    return { theme, offers: take };
  });
}

function linkDetails(p, squad) {
  let club = 0;
  let nation = 0;
  let league = 0;
  for (const s of squad) {
    if (s.id === p.id) continue;
    if (s.club === p.club) club++;
    else if (s.nation === p.nation) nation++;
    else if (s.league === p.league) league++;
  }
  return { club, nation, league, pts: club * 3 + nation * 2 + league };
}

function totalLinks(squad) {
  const acc = { club: 0, nation: 0, league: 0 };
  for (let i = 0; i < squad.length; i++) {
    for (let j = i + 1; j < squad.length; j++) {
      const a = squad[i];
      const b = squad[j];
      if (a.club === b.club) acc.club++;
      else if (a.nation === b.nation) acc.nation++;
      else if (a.league === b.league) acc.league++;
    }
  }
  return acc;
}

const CONFETTI_COLORS = ['#39ff14', '#00ffff', '#ffd700', '#ff00ff', '#ff6b6b', '#ffffff'];

const RIVAL_NAMES = ['Ironwall XI', 'Skyliner City', 'Golden Gate', 'Redline FC', 'Cobalt United', 'Northwall Athletic', 'Vortex FC', 'Highline Rovers', 'Metro Strikers'];
const MATCHDAYS = 9;
const POS_GROUPS = { GK: ['GK'], DF: ['CB', 'LB', 'RB'], MF: ['CM', 'CAM', 'CDM', 'RM', 'LM'], FW: ['ST', 'CF', 'LW', 'RW'] };

function buildCpuSquad(pool) {
  const squad = [];
  const order = ['GK', 'DF', 'DF', 'MF', 'MF', 'MF', 'FW'];
  for (const group of order) {
    const i = pool.findIndex(p => POS_GROUPS[group].includes(p.position));
    const src = i >= 0 ? pool.splice(i, 1)[0] : pool.shift();
    if (src) squad.push(src);
  }
  return squad;
}

function pickScorer(team) {
  const att = team.filter(p => ['ST', 'CF', 'LW', 'RW', 'CAM'].includes(p.position));
  const pool = att.length ? att : team.filter(p => p.position !== 'GK');
  const src = pool.length ? pool : team;
  return src[Math.floor(Math.random() * src.length)];
}

function simMatch(aStr, bStr, home) {
  const d = aStr - bStr + (home ? 1.1 : 0) + (Math.random() - 0.5) * 3.2;
  const mean = Math.max(0.26, 1.15 + d * 0.42);
  const gf = Math.max(0, Math.round(mean * (0.55 + Math.random() * 0.9)));
  const ga = Math.max(0, Math.round(Math.max(0.3, mean - d * 0.3) * (0.4 + Math.random() * 0.9)));
  return { gf, ga };
}

function sortTable(teams) {
  return teams.slice().sort((a, b) => {
    const pa = a.W * 3 + a.D;
    const pb = b.W * 3 + b.D;
    if (pa !== pb) return pb - pa;
    const gda = a.GF - a.GA;
    const gdb = b.GF - b.GA;
    if (gda !== gdb) return gdb - gda;
    return b.GF - a.GF;
  });
}

function Confetti() {
  const [pieces] = useState(() => Array.from({ length: 60 }).map((_, i) => ({
    left: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 1.2,
    dur: 2 + Math.random() * 2,
    rot: Math.random() * 360
  })));
  return (
    <div className="confetti-layer">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            transform: `rotate(${p.rot}deg)`
          }}
        />
      ))}
    </div>
  );
}

export default function Draft({ onFinish }) {
  const [rounds] = useState(buildDraft);
  const [round, setRound] = useState(0);
  const [squad, setSquad] = useState([]);
  const [finalized, setFinalized] = useState(false);
  const [sentToClub, setSentToClub] = useState(false);
  const [season, setSeason] = useState(null);
  const [sim, setSim] = useState(null);
  const committedRef = useRef(false);

  const chem = useMemo(() => squadChemistry(squad), [squad]);
  const grade = useMemo(() => chemistryGrade(chem, squad.length || 1), [chem, squad]);
  const eff = useMemo(() => (squad.length ? effectiveRating(squad) : { overall: 0, chem: 0, bonus: 0, effective: 0 }), [squad]);
  const formation = useMemo(() => (squad.length ? formationFrom(squad) : null), [squad]);

  function choose(player) {
    const next = [...squad, player];
    setSquad(next);
    if (round + 1 >= rounds.length) {
      const e = effectiveRating(next);
      setFinalized(true);
      onFinish({ xp: 250 + e.bonus * 30, packs: 2, win: true, draft: true });
      return;
    }
    setRound(round + 1);
  }

  function sendToClub() {
    setSentToClub(true);
    onFinish({ xp: 150 });
  }

  function startSeason() {
    const used = new Set(squad.map(p => p.id));
    const pool = shuffle(players.filter(p => !used.has(p.id)));
    const cpuTeams = RIVAL_NAMES.map(name => {
      const s = buildCpuSquad(pool);
      return {
        name, squad: s, isUser: false,
        P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0,
        str: effectiveRating(s).effective
      };
    });
    const teams = [
      { name: 'Your XI', squad, isUser: true, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, str: eff.effective },
      ...cpuTeams
    ];
    const fixtures = cpuTeams.map((_, i) => ({ vsIdx: i + 1, home: i % 2 === 0 }));
    const allCpuPairs = [];
    for (let a = 1; a <= 9; a++) {
      for (let b = a + 1; b <= 9; b++) allCpuPairs.push([a, b]);
    }
    shuffle(allCpuPairs);
    const cpuDays = Array.from({ length: MATCHDAYS }, (_, d) => allCpuPairs.slice(d * 4, d * 4 + 4));
    setSeason({ teams, fixtures, cpuDays, matchday: 0, results: [], finished: false });
  }

  function startMatch() {
    if (!season || season.finished) return;
    committedRef.current = false;
    const opp = season.teams[season.fixtures[season.matchday].vsIdx];
    const m = simMatch(eff.effective, opp.str, season.fixtures[season.matchday].home);
    setSim({ minute: 0, gf: 0, ga: 0, fGf: m.gf, fGa: m.ga, events: [], nextGM: 8, nextAM: 15, done: false, opp });
  }

  function tick(s) {
    if (!s) return s;
    let { minute, gf, ga, fGf, fGa, events, nextGM, nextAM } = s;
    minute += 1 + Math.floor(Math.random() * 4);
    while (minute >= nextGM && gf < fGf) {
      gf += 1;
      const sc = pickScorer(squad);
      events = [...events, { m: Math.min(90, nextGM), name: sc.name }];
      nextGM += 3 + Math.floor(Math.random() * 16);
    }
    while (minute >= nextAM && ga < fGa) {
      ga += 1;
      const sc = pickScorer(s.opp.squad);
      events = [...events, { m: Math.min(90, nextAM), name: sc.name, opp: true }];
      nextAM += 3 + Math.floor(Math.random() * 16);
    }
    const done = minute >= 93;
    return { ...s, minute, gf, ga, events, nextGM, nextAM, done };
  }

  useEffect(() => {
    if (!season || season.finished || !sim || committedRef.current) return;
    if (sim.done) {
      const t = setTimeout(() => { committedRef.current = true; commitMatch(sim); }, 1100);
      return () => clearTimeout(t);
    }
    const id = setInterval(() => setSim(tick), 620);
    return () => clearInterval(id);
  });

  function skipSim() {
    if (!sim || committedRef.current) return;
    committedRef.current = true;
    commitMatch(sim);
  }

  function commitMatch(sim) {
    if (!season || season.finished) return;
    const { matchday: d, fixtures, cpuDays, results } = season;
    const teams = sortTable(season.teams.map(t => ({ ...t })));
    const byIdx = idx => teams[idx];
    const res = [];

    const user = byIdx(0);
    const opp = byIdx(fixtures[d].vsIdx);
    const m = sim ? { gf: sim.fGf, ga: sim.fGa } : simMatch(user.str, opp.str, fixtures[d].home);
    user.GF += m.gf; user.GA += m.ga; user.P++;
    opp.GF += m.ga; opp.GA += m.gf; opp.P++;
    if (m.gf > m.ga) { user.W++; opp.L++; } else if (m.gf < m.ga) { user.L++; opp.W++; } else { user.D++; opp.D++; }
    res.push({ home: 0, away: fixtures[d].vsIdx, gf: m.gf, ga: m.ga, user: true });

    cpuDays[d].forEach(([a, b]) => {
      const ha = byIdx(a);
      const hb = byIdx(b);
      const mm = simMatch(ha.str, hb.str, true);
      ha.GF += mm.gf; ha.GA += mm.ga; ha.P++;
      hb.GF += mm.ga; hb.GA += mm.gf; hb.P++;
      if (mm.gf > mm.ga) { ha.W++; hb.L++; } else if (mm.gf < mm.ga) { ha.L++; hb.W++; } else { ha.D++; hb.D++; }
      res.push({ home: a, away: b, gf: mm.gf, ga: mm.ga, user: false });
    });

    const finished = d + 1 >= MATCHDAYS;
    const nextTeams = sortTable(teams);
    setSeason({
      ...season,
      teams: nextTeams,
      matchday: d + 1,
      finished,
      results: [...res, ...results]
    });
    setSim(null);
    if (finished) {
      const rank = nextTeams.findIndex(t => t.isUser) + 1;
      onFinish({ xp: 320, packs: rank === 1 ? 2 : 1, win: rank === 1, rivals: true });
    }
  }

  function exitSeason() {
    setSeason(null);
    setSim(null);
  }

  function rebuild() {
    setRound(0);
    setSquad([]);
    setFinalized(false);
    setSentToClub(false);
    setSeason(null);
    setSim(null);
  }

  if (season) {
    const nextFixture = season.finished ? null : season.fixtures[season.matchday];
    const opponent = nextFixture ? season.teams[nextFixture.vsIdx] : null;
    const rank = season.finished ? season.teams.findIndex(t => t.isUser) + 1 : null;
    const champion = rank === 1;
    const yourName = season.teams.find(t => t.isUser)?.name || 'Your XI';
    const last = season.results[0];
    return (
      <div className="mode-body">
        {season.finished && champion && <Confetti />}
        <div className="rivals-season">
          <div className="rivals-head">
            <div>
              <span className="eyebrow">Rivals League</span>
              <h3>{season.finished ? 'Season complete' : `Matchday ${season.matchday + 1} of ${MATCHDAYS}`}</h3>
            </div>
            <div className="rivals-metrics">
              <span className="rivals-metric"><small>YOUR XI</small><b>{eff.overall} OVR</b></span>
              <span className="rivals-metric"><small>CHEM</small><b style={{ color: grade.color }}>{chem}</b></span>
              <span className="rivals-metric"><small>EFF</small><b className="metric-gold">{eff.effective}</b></span>
            </div>
          </div>

          {season.finished ? (
            <div className={`rivals-champion ${champion ? 'won' : ''}`}>
              <strong>{champion ? 'CHAMPIONS OF THE RIVALS LEAGUE' : `You finished ${rank}${rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'} in the league.`}</strong>
              <span>{champion ? 'Unbeatable. The trophy room is calling.' : 'A solid campaign — tweak the draft and go again.'}</span>
            </div>
          ) : sim ? (
            <div className="rivals-sim">
              <div className="rivals-sim-head">
                <span className="eyebrow">LIVE · Matchday {season.matchday + 1}</span>
                <h3>{yourName} <strong className="sim-score">{sim.gf}–{sim.ga}</strong> {sim.opp.name}</h3>
                <div className="sim-clock">{sim.minute > 90 ? '90+' : sim.minute}<em>'</em></div>
              </div>
              <div className="sim-pitchbar"><div style={{ width: `${(sim.minute / 93) * 100}%` }} /></div>
              <div className="sim-feed">
                {sim.events.length === 0 ? (
                  <p className="muted">Kick-off… the crowd is settling in.</p>
                ) : sim.events.slice(-6).map((e, i) => (
                  <div className="sim-event" key={i}>
                    <span className="sim-min">{e.m}'</span>
                    <span className={e.opp ? 'sim-goal-opp' : 'sim-goal'}>GOAL</span>
                    <em>{e.name}</em>
                    <small className="muted">{e.opp ? sim.opp.name : yourName}</small>
                  </div>
                ))}
              </div>
              <div className="sim-controls">
                <span className="muted">Simulating {yourName} vs {sim.opp.name}</span>
                <button className="secondary-button" onClick={skipSim}>Skip simulation ▸▸</button>
              </div>
            </div>
          ) : (
            <div className="rivals-next">
              <div className="rivals-next-opp">
                <span className="muted">NEXT OPPONENT</span>
                <strong>{opponent.name}</strong>
                <em>{opponent.str} effective · {formationFrom(opponent.squad).label} shape</em>
              </div>
              {last && (
                <div className={`rivals-last banner-${last.gf > last.ga ? 'win' : last.gf < last.ga ? 'loss' : 'draw'}`}>
                  <span>MD{Math.min(season.matchday, MATCHDAYS)}</span>
                  <strong>{season.teams[0].name} {last.gf}–{last.ga} {opponent ? '' : ''} {last.away === 0 ? season.teams[last.home].name : season.teams[last.away].name}</strong>
                </div>
              )}
              <button className="primary-button" onClick={startMatch}>Play matchday {season.matchday + 1}</button>
            </div>
          )}

          <div className="rivals-table-wrap">
            <table className="rivals-table">
              <thead>
                <tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
              </thead>
              <tbody>
                {season.teams.map((t, i) => {
                  const pts = t.W * 3 + t.D;
                  const gd = t.GF - t.GA;
                  return (
                    <tr key={t.name} className={t.isUser ? 'rivals-row-user' : ''}>
                      <td>{i + 1}</td>
                      <td className="rivals-team">{t.isUser && <span className="rivals-me">YOU</span>}{t.name}</td>
                      <td>{t.P}</td><td>{t.W}</td><td>{t.D}</td><td>{t.L}</td><td>{t.GF}</td><td>{t.GA}</td><td>{gd >= 0 ? `+${gd}` : gd}</td>
                      <td className="rivals-pts">{pts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="rivals-results">
            {season.results.slice(0, 6).map((r, i) => {
              const won = r.gf > r.ga;
              const drew = r.gf === r.ga;
              const badge = r.user ? (won ? 'W' : drew ? 'D' : 'L') : null;
              return (
                <div key={i} className={`rivals-result ${r.user ? (won ? 'win' : drew ? 'draw' : 'loss') : 'cpu'}`}>
                  <span className="rivals-md">MD{r.md + 1}</span>
                  <strong>{season.teams[r.home].name} {r.gf}–{r.ga} {season.teams[r.away].name}</strong>
                  {badge && <span className="rivals-badge">{badge}</span>}
                </div>
              );
            })}
          </div>

          <div className="draft-actions">
            {!season.finished && <button className="secondary-button" onClick={exitSeason}>Abandon season</button>}
            <button className="secondary-button" onClick={rebuild}>New draft</button>
          </div>
        </div>
      </div>
    );
  }

  if (finalized) {
    const fw = squad.filter(p => ['ST', 'CF', 'LW', 'RW'].includes(p.position)).length;
    const mf = squad.filter(p => ['CM', 'CAM', 'CDM'].includes(p.position)).length;
    const df = squad.filter(p => ['CB', 'LB', 'RB'].includes(p.position)).length;
    const links = totalLinks(squad);
    return (
      <div className="mode-body">
        <Confetti />
        <div className="draft-final">
          <span className="eyebrow">Draft complete</span>
          <h3 className="draft-final-title">Your squad is ready</h3>
          <div className="draft-final-metrics">
            <div className="draft-metric">
              <small>SQUAD OVR</small>
              <strong className="metric-big">{eff.overall}</strong>
            </div>
            <div className="draft-metric">
              <small>CHEMISTRY</small>
              <strong className="metric-big" style={{ color: grade.color }}>{chem}</strong>
            </div>
            <div className="draft-metric">
              <small>FORMATION</small>
              <strong className="metric-big">{formation.label}</strong>
            </div>
            <div className="draft-metric">
              <small>EFFECTIVE RATING</small>
              <strong className="metric-big metric-gold">{eff.effective} <span className="metric-plus">+{eff.bonus}</span></strong>
            </div>
          </div>

          <div className="formation-chips">
            <span>{fw} Forward</span>
            <span>{mf} Midfield</span>
            <span>{df} Defence</span>
          </div>

          <div className="draft-links">
            <span className="draft-link">{links.club} club link{links.club === 1 ? '' : 's'}</span>
            <span className="draft-link">{links.nation} nation link{links.nation === 1 ? '' : 's'}</span>
            <span className="draft-link">{links.league} league link{links.league === 1 ? '' : 's'}</span>
          </div>

          <div className="draft-squad">
            {squad.map(p => <PlayerCard key={p.id} player={p} size="sm" tilt={false} flippable={false} />)}
          </div>

          <div className="draft-actions">
            <button className="primary-button" onClick={startSeason}>Start Rivals season</button>
            <button className={`secondary-button ${sentToClub ? 'done' : ''}`} disabled={sentToClub} onClick={sendToClub}>
              {sentToClub ? '✓ +150 XP' : 'Claim draft XP'}
            </button>
            <button className="secondary-button" onClick={rebuild}>
              ↻ Rebuild another draft
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = rounds[round];
  return (
    <div className="mode-body draft-layout">
      <aside className="draft-board">
        <span className="eyebrow">Your draft</span>
        <div className="formation-map">
          {['FW', 'MF', 'DF'].map(zone => {
            const zonePlayers = squad.filter(p =>
              zone === 'FW' ? ['ST', 'CF', 'LW', 'RW'].includes(p.position) :
              zone === 'MF' ? ['CM', 'CAM', 'CDM', 'RM', 'LM'].includes(p.position) :
              ['CB', 'LB', 'RB', 'GK'].includes(p.position)
            );
            return (
              <div key={zone} className={`formation-zone zone-${zone.toLowerCase()}`}>
                <span className="zone-label">{zone}</span>
                <div className="zone-slots">
                  {Array.from({ length: 3 }).map((_, i) => {
                    const p = zonePlayers[i];
                    return (
                      <div key={i} className={`zone-slot ${p ? 'filled' : ''}`}>
                        {p ? <strong>{p.code}</strong> : <span>·</span>}
                        {p && <em>{p.position}</em>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="click-chem">
          <div className="click-chem-top">
            <span>Chemistry</span>
            <strong style={{ color: grade.color }}>{grade.letter}</strong>
          </div>
          <div className="click-chem-bar"><div style={{ width: `${Math.min(100, (chem / 30) * 100)}%`, background: grade.color }} /></div>
          <span className="muted">{grade.label}</span>
        </div>
      </aside>

      <section className="draft-main">
        <div className="round-header">
          <div>
            <span className="eyebrow">Pick {round + 1} of 7</span>
            <h3>{current.theme.label}</h3>
            <p className="muted">{current.theme.subtitle}</p>
          </div>
        </div>

        <div className="draft-offers">
          {current.offers.map(player => {
            const projected = squadChemistry([...squad, player]);
            const delta = projected - chem;
            const lk = linkDetails(player, squad);
            return (
              <div className="draft-offer" key={player.id}>
                <PlayerCard player={player} size="sm" flippable={false} onClick={() => choose(player)} actionLabel="Pick for round" />
                {squad.length > 0 && (
                  <span className={`draft-chem-badge ${delta >= 0 ? 'up' : 'down'}`}>
                    {delta >= 0 ? `+${delta}` : delta} CHEM
                    <em>{lk.club > 0 ? `${lk.club} club` : ''}{lk.nation > 0 ? `${lk.club > 0 ? ' · ' : ''}${lk.nation} nation` : ''}{lk.league > 0 && lk.club === 0 && lk.nation === 0 ? `${lk.league} league` : ''}</em>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="chosen-strip">
          {squad.map(p => (
            <span key={p.id} className={`chosen-chip rarity-${p.rarity.toLowerCase()}`}><b>{p.code}</b> {p.position}</span>
          ))}
        </div>
      </section>
    </div>
  );
}