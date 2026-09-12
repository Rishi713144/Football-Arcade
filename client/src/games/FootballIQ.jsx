import { useState, useEffect } from 'react';
import { iqCategories } from '../data/quizBank';

const QUESTION_TIME = 12;
const ORDER_TIME = 20;

function pointsFor(item) {
  if (item.type === 'order') return 20;
  if (item.type === 'clue') return 15;
  return 10;
}

function timeFor(item) {
  return item.type === 'order' ? ORDER_TIME : QUESTION_TIME;
}

function TYPE_LABEL(type) {
  return { mcq: 'Choice round', truefalse: 'True or false', order: 'Chronology', clue: 'Guess the player' }[type] || 'Quiz';
}

export default function FootballIQ({ onFinish }) {
  const [category, setCategory] = useState(null);
  const [order, setOrder] = useState([]);
  const [idx, setIdx] = useState(0);
  const [points, setPoints] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [done, setDone] = useState(false);
  const [selections, setSelections] = useState([]);
  const [chosenIndex, setChosenIndex] = useState(-1);
  const [seq, setSeq] = useState([]);

  function start(cat) {
    const qs = [...cat.questions].sort(() => Math.random() - 0.5);
    setCategory(cat);
    setOrder(qs);
    setIdx(0);
    setPoints(0);
    setSelections([]);
    setAnswered(false);
    setDone(false);
    setTimeLeft(timeFor(qs[0]));
    setChosenIndex(-1);
    setSeq([]);
  }

  function choose(optionIndex) {
    if (answered) return;
    const item = order[idx];
    const isRight = optionIndex === item.a;
    setAnswered(true);
    setCorrect(isRight);
    setSelections(s => [...s, isRight]);
    if (isRight) setPoints(p => p + pointsFor(item));
    setTimeout(() => next(), 1100);
  }

  function tapOrder(i) {
    if (answered || seq.includes(i)) return;
    setSeq(s => [...s, i]);
  }

  useEffect(() => {
    if (!answered && seq.length === 3) {
      const right = seq.every((v, i) => v === i);
      setAnswered(true);
      setCorrect(right);
      setSelections(s => [...s, right]);
      if (right) setPoints(p => p + pointsFor(order[idx]));
      setTimeout(() => next(), 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, seq]);

  function next() {
    if (idx + 1 >= order.length) {
      setDone(true);
      const total = order.reduce((a, q) => a + pointsFor(q), 0);
      const pct = total ? Math.round((points / total) * 100) : 0;
      onFinish({ xp: pct === 100 ? 150 : Math.max(30, Math.round(120 * (pct / 100))), category: category.title });
      return;
    }
    const nIdx = idx + 1;
    setIdx(nIdx);
    setAnswered(false);
    setTimeLeft(timeFor(order[nIdx]));
    setChosenIndex(-1);
    setSeq([]);
  }

  function finishEarly() {
    setDone(true);
    onFinish({ xp: 40, category: category.title });
  }

  useEffect(() => {
    if (!category || done || answered) return;
    if (timeLeft <= 0) {
      setSelections(s => [...s, false]);
      setAnswered(true);
      setCorrect(false);
      setChosenIndex(-2);
      setTimeout(() => next(), 1100);
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, done, answered, timeLeft]);

  if (!category) {
    const maxXp = q => q.questions.reduce((a, item) => a + pointsFor(item), 0);
    return (
      <div className="mode-body">
        <p className="muted">Pick a panel. Four different round styles — choice, true or false, chronology and guess-the-player — all on the clock.</p>
        <div className="cat-grid">
          {iqCategories.map(cat => (
            <button className="cat-card" key={cat.id} onClick={() => start(cat)}>
              <strong>{cat.title}</strong>
              <span className="muted">{cat.questions.length} rounds · up to {maxXp(cat)} XP</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (done) {
    const total = order.reduce((a, q) => a + pointsFor(q), 0);
    const pct = total ? Math.round((points / total) * 100) : 0;
    const grade = pct >= 90 ? 'Icon IQ' : pct >= 70 ? 'Maestro' : pct >= 50 ? 'Scholarship' : pct >= 30 ? 'Apprentice' : 'Ball Boy';
    return (
      <div className="mode-body center">
        <div className={`iq-grade grade-${grade.replace(/\s/g, '').toLowerCase()}`}>
          <span className="iq-grade-val">{points} / {total} pts</span>
          <strong>{grade}</strong>
          <p className="muted">{pct}% — {category.title}</p>
        </div>
        <div className="iq-bars">
          {order.map((_, i) => <span key={i} className={selections[i] ? 'right' : 'wrong'} />)}
        </div>
        <button className="secondary-button" onClick={() => setCategory(null)}>↻ Choose another panel</button>
      </div>
    );
  }

  const item = order[idx];
  const t = timeFor(item);

  return (
    <div className="mode-body">
      <div className="iq-topline">
        <span className="eyebrow">{TYPE_LABEL(item.type)} · {category.title}</span>
        <span className="iq-count">Q{idx + 1}/{order.length}</span>
        <button className="text-button" onClick={finishEarly}>End round</button>
      </div>
      <div className={`iq-timer ${timeLeft <= 3 ? 'danger' : ''}`} style={{ '--t': `${(timeLeft / t) * 100}%` }} />
      <h3 className="iq-question">{item.q}</h3>

      {item.type === 'order' && (
        <>
          <p className="muted iq-hint">Tap the items in the right order{seq.length > 0 ? ' — keep going' : ' to begin'}.</p>
          <div className="order-stage">
            {seq.map((v, s) => <span key={`${v}-${s}`} className={`order-drop ${answered ? (v === s ? 'right' : 'wrong') : ''}`}>{s + 1}</span>)}
            {seq.length < 3 && <span className="order-empty" />}
          </div>
          <div className="order-list">
            {item.items.map((val, i) => (
              <button
                key={val}
                disabled={answered}
                className={`order-chip ${!answered && seq.includes(i) ? 'picked' : ''} ${answered ? (i === seq.indexOf(i) ? 'is-right' : 'is-wrong') : ''}`}
                onClick={() => tapOrder(i)}
              >
                {val}
              </button>
            ))}
          </div>
        </>
      )}

      {item.type === 'clue' && (
        <div className="intel-strip">
          {item.intel.map((line, i) => <span key={i} className="intel-chip">{line}</span>)}
        </div>
      )}

      {item.type !== 'order' && (
        <div className={`choice-grid ${item.type === 'truefalse' ? 'choice-vf' : ''}`}>
          {item.options.map((opt, i) => (
            <button
              key={opt}
              disabled={answered}
              className={`choice-button ${answered ? (i === item.a ? 'is-right' : i === chosenIndex ? 'is-wrong' : 'is-dim') : ''}`}
              onClick={() => { setChosenIndex(i); choose(i); }}
            >
              {item.type !== 'truefalse' && <span className="dna-letter">{String.fromCharCode(65 + i)}</span>}
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}

      {answered && correct && item.type === 'order' && <p className="iq-fact">✔ Sequence right! {item.fact}</p>}
      {answered && !correct && item.type === 'order' && <p className="iq-fact">✘ The order was 1-2-3. {item.fact}</p>}
      {answered && item.type !== 'order' && <p className="iq-fact">{correct ? '✔ Correct! ' : '✘ Not quite. '}{item.fact}</p>}
    </div>
  );
}