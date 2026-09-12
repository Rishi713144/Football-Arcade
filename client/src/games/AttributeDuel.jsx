import { useMemo, useState } from 'react';
import { players, shuffle, STAT_KEYS, STAT_LABELS } from '../data/players';
import PlayerCard from '../components/PlayerCard';

const ATTRIBUTES = ['overall', ...STAT_KEYS, 'chem'];

function randTeam(avoid = []) {
  const pool = players.filter(p => !avoid.includes(p.id));
  return shuffle(pool).slice(0, 5);
}

function linksOf(team) {
  let clubLinks = 0;
  let nationLinks = 0;
  for (let i = 0; i < team.length; i++) {
    for (let j = i + 1; j < team.length; j++) {
      if (team[i].club === team[j].club) clubLinks++;
      else if (team[i].nation === team[j].nation) nationLinks++;
    }
  }
  return { clubLinks, nationLinks, score: clubLinks * 2 + nationLinks };
}

export default function AttributeDuel({ onFinish }) {
  const [offers] = useState(() => shuffle(players).slice(0, 10));
  const [picked, setPicked] = useState([]);
  const [cpuTeam, setCpuTeam] = useState(null);
  const [report, setReport] = useState(null);

  const offering = useMemo(() => offers, [offers]);

  function toggle(player) {
    if (cpuTeam || report) return;
    setPicked(prev => {
      if (prev.includes(player)) return prev.filter(p => p.id !== player.id);
      if (prev.length >= 5) return prev;
      return [...prev, player];
    });
  }

  function battle() {
    const cpu = randTeam(picked.map(p => p.id));
    const mScore = linksOf(picked).score;
    const cScore = linksOf(cpu).score;
    const rows = picked.map((mine, i) => {
      const opponent = cpu[i];
      const cells = {};
      let uWins = 0;
      let cWins = 0;
      ATTRIBUTES.forEach(stat => {
        const mv = stat === 'overall' ? mine.overall : stat === 'chem' ? mScore : mine.stats[stat];
        const cv = stat === 'overall' ? opponent.overall : stat === 'chem' ? cScore : opponent.stats[stat];
        if (mv > cv) { cells[stat] = 'win'; uWins++; }
        else if (cv > mv) { cells[stat] = 'loss'; cWins++; }
        else cells[stat] = 'draw';
      });
      return {
        mine, opponent, cells, uWins, cWins,
        result: uWins > cWins ? 'win' : uWins < cWins ? 'loss' : 'draw'
      };
    });
    const wins = rows.filter(r => r.result === 'win').length;
    const losses = rows.filter(r => r.result === 'loss').length;
    const draws = rows.length - wins - losses;
    setCpuTeam(cpu);
    setReport({ rows, wins, losses, draws, mScore, cScore });
    onFinish({ xp: 80 + wins * 40, packs: wins >= 3 ? 1 : 0, win: wins >= 3 });
  }

  function rematch() {
    setPicked([]);
    setCpuTeam(null);
    setReport(null);
  }

  if (report) {
    return (
      <div className="mode-body">
        <div className="duel-scorecard">
          <div className={`duel-result-result ${report.wins >= 3 ? 'win' : 'lose'} mb`}>
            <strong>{report.wins >= 3 ? 'VICTORY' : report.wins === report.losses ? 'DRAW' : 'DEFEAT'}</strong>
            <span>You won {report.wins}, lost {report.losses}, drew {report.draws} of {report.rows.length} matchups</span>
          </div>
          {report.wins >= 3 && <div className="duel-prize">+1 PACK awarded</div>}
        </div>

        <div className="duel-table-wrap">
          <table className="duel-table">
            <thead>
              <tr>
                <th>YOUR XI</th>
                {ATTRIBUTES.map(a => <th key={a}>{a === 'overall' ? 'OVR' : a === 'chem' ? 'CHM' : STAT_LABELS[a]}</th>)}
                <th>CPU XI</th>
              </tr>
            </thead>
            <tbody>
              {report.rows.map((r, i) => (
                <tr key={i} className={`duel-row-${r.result}`}>
                  <td><span className={`pos-dot pos-${r.mine.position}`} />{r.mine.name}</td>
                  {ATTRIBUTES.map(a => {
                    const v = a === 'overall' ? r.mine.overall : a === 'chem' ? report.mScore : r.mine.stats[a];
                    const cv = a === 'overall' ? r.opponent.overall : a === 'chem' ? report.cScore : r.opponent.stats[a];
                    return <td key={a} className={r.cells[a]}><span className="duel-v">{v}</span>{v !== cv && <span className="duel-cv">{cv}</span>}</td>;
                  })}
                  <td><span className={`pos-dot pos-${r.opponent.position}`} />{r.opponent.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="duel-legend">
          <span className="lg win">▲ You</span>
          <span className="lg loss">▼ CPU</span>
          <span className="lg draw">= Level</span>
          <span className="lg neutral">CHM = club & nation links (chem score)</span>
        </div>
        <button className="secondary-button" onClick={rematch}>↻ Rematch</button>
      </div>
    );
  }

  return (
    <div className="mode-body">
      {picked.length < 5 && <p className="muted pick-hint">Pick five distinct players for your five-a-side team. Link same-club or same-nation players to build a Chemistry stat — it joins the duel. <strong>{picked.length}/5</strong> selected.</p>}
      <div className="picked-strip">
        {picked.map(p => (
          <div className="picked-chip" key={p.id} onClick={() => toggle(p)}>
            <span className={`pos-dot pos-${p.position}`} />{p.code} <em>{p.position}</em>
          </div>
        ))}
        {picked.length < 5 && Array.from({ length: 5 - picked.length }).map((_, i) => <div className="picked-chip empty" key={i}>?</div>)}
      </div>
      {picked.length === 5 && (() => {
        const lk = linksOf(picked);
        return <div className="duel-chem"><span className="duel-chem-score">CHEM {lk.score}</span><span>{lk.clubLinks} club link{lk.clubLinks === 1 ? '' : 's'} · {lk.nationLinks} nation link{lk.nationLinks === 1 ? '' : 's'}</span></div>;
      })()}

<div className="player-pick-grid five">
          {offering.map(player => {
            const isPicked = picked.some(p => p.id === player.id);
            const locked = picked.length >= 5 && !isPicked;
            return (
              <div
                key={player.id}
                className={`duel-pick ${isPicked ? 'picked' : ''} ${locked ? 'locked' : ''}`}
              >
                <PlayerCard
                  player={player}
                  size="sm"
                  tilt={!locked}
                  disabled={locked}
                  flippable={false}
                  onClick={() => toggle(player)}
                  actionLabel={isPicked ? 'Remove' : 'Add to XI'}
                />
                {isPicked && <span className="duel-pick-badge">IN XI</span>}
              </div>
            );
          })}
        </div>

      <button className="primary-button duel-launch" disabled={picked.length < 5} onClick={battle}>
        {picked.length < 5 ? `Select ${5 - picked.length} more` : 'Kick off the duel'}
      </button>
    </div>
  );
}