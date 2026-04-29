(function () {
  function el(html) { const d = document.createElement('div'); d.innerHTML = html; return d.firstElementChild; }
  function shuffleArray(items) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  async function fetchWikiSummary(title) {
    if (!title) return null;
    try {
      const encoded = encodeURIComponent(title.replace(/ /g, '_'));
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (e) { console.warn('Wiki fetch failed', e); return null; }
  }

  window.startPlanetQuizzes = function () {
    const container = document.getElementById('quizzesContent');
    container.innerHTML = '';

    const quizzes = [
      {
        id: 'career_path',
        title: 'Career Path Guess',
        desc: 'Identify a footballer by the clubs they played for. Clubs revealed one by one.',
        questions: []
      },
      {
        id: 'guess_footballer',
        title: 'Guess The Footballer',
        desc: 'Identify famous footballers from progressive hints.',
        questions: []
      },
      {
        id: 'records',
        title: 'Football Records',
        desc: 'Test your knowledge of football records and statistics.',
        questions: [
          { q: 'Who is the all-time top scorer in international football?', options: ['Cristiano Ronaldo (130)', 'Ali Daei (109)', 'Lionel Messi (98)', 'Pelé (77)'], a: 0, hint: 'Portuguese forward, current holder' },
          { q: 'How many FIFA World Cup trophies has Brazil won?', options: ['3', '5', '4', '6'], a: 2, hint: 'Won in 1958, 1962, 1970, 1994, 2002' },
          { q: 'Which team won the most UEFA Champions League titles?', options: ['Barcelona (5)', 'AC Milan (7)', 'Real Madrid (14)', 'Bayern Munich (6)'], a: 2, hint: 'Spanish club, dominant in recent years' },
          { q: 'Who holds the record for most goals in a single Premier League season?', options: ['Sergio Agüero (32)', 'Harry Kane (36)', 'Mohamed Salah (42)', 'Alan Shearer (34)'], a: 2, hint: 'Egyptian striker, 2017-18 season' },
          { q: 'Which player won the most Ballon d\'Or awards in history?', options: ['Cristiano Ronaldo (5)', 'Lionel Messi (8)', 'Pelé (3)', 'Diego Maradona (2)'], a: 1, hint: 'Argentine striker, retired 2023' }
        ]
      },
      {
        id: 'tactics',
        title: 'Tactics & Formations',
        desc: 'Identify famous tactics and formations used in football.',
        questions: [
          { q: 'What formation is commonly known as "The Christmas Tree"?', options: ['3-5-2', '4-3-3', '5-3-2', '4-2-3-1'], a: 0, hint: 'Asymmetric formation with 5 defenders' },
          { q: 'Which tactic involves pressing opponents high up the pitch?', options: ['Gegenpressing', 'Parking the Bus', 'Low Block', 'Catenaccio'], a: 0, hint: 'German term popularized by Jürgen Klopp' },
          { q: 'What is the classic 2-3-5 formation also known as?', options: ['WM Formation', 'M-Formation', 'Pyramid', 'Pyramid Attack'], a: 0, hint: 'Used in early 1900s' },
          { q: 'Which formation did Pep Guardiola famously use at Barcelona?', options: ['4-4-2', '4-3-3', '3-5-2', '5-3-2'], a: 1, hint: 'Also called tiki-taka' },
          { q: 'What defensive tactic involves staying compact near your goal?', options: ['Pressing', 'Counter-Attack', 'Parking the Bus', 'Offside Trap'], a: 2, hint: 'Catenaccio-style play' }
        ]
      },
      {
        id: 'finals',
        title: 'Famous Finals',
        desc: 'Recall iconic football finals and their outcomes.',
        questions: [
          { q: 'In which year did Argentina win their first FIFA World Cup?', options: ['1978', '1986', '1990', '2022'], a: 0, hint: 'Won against Netherlands' },
          { q: 'Which team won the 1999 UEFA Champions League final with a 93rd minute goal?', options: ['Real Madrid', 'Manchester United', 'Bayern Munich', 'Barcelona'], a: 1, hint: 'English club, treble winners' },
          { q: 'What was the score in the 2006 World Cup final between France and Italy?', options: ['2-1', '1-1 (2-1 AET)', '3-0', '0-1'], a: 1, hint: 'Zidane head-butted Materazzi' },
          { q: 'Which country hosted the first FIFA World Cup in 1930?', options: ['Italy', 'France', 'Uruguay', 'Brazil'], a: 2, hint: 'South American country' },
          { q: 'Who won the 2016 UEFA Euro Championship?', options: ['France', 'Portugal', 'Spain', 'England'], a: 1, hint: 'Underdog victory' }
        ]
      },
      {
        id: 'awards',
        title: 'Awards & Honours',
        desc: 'Test your knowledge of football awards and accolades.',
        questions: [
          { q: 'Which award is given to the best goalkeeper at the FIFA World Cup?', options: ['Golden Boot', 'Yashin Award', 'Golden Glove', 'Best Keeper'], a: 1, hint: 'Named after Soviet goalkeeper' },
          { q: 'How many Ballon d\'Or awards has Cristiano Ronaldo won?', options: ['3', '5', '7', '8'], a: 1, hint: 'Won from 2008 onwards' },
          { q: 'Who was the first non-European player to win the Ballon d\'Or?', options: ['Pelé', 'Ronaldo (Brazilian)', 'Ronaldinho', 'Maradona'], a: 1, hint: 'Brazilian striker, won in 1997' },
          { q: 'Which award is presented to the top scorer at Euro Championships?', options: ['Golden Boot', 'Silver Boot', 'Bronze Boot', 'Player of the Tournament'], a: 0, hint: 'Highest goalscorer' },
          { q: 'What is The Best FIFA Men\'s Player award based on?', options: ['Only fan votes', 'Only expert votes', 'Fan + Player + Media voting', 'Media only'], a: 2, hint: 'Multiple voting methods combined' }
        ]
      }
    ];

    const list = el(`<div class="card">
      <h3>Arcade Quizzes</h3>
      <p style="color:var(--text-secondary)">Multiple football quiz categories. Pick one and test your knowledge!</p>
      <div id="qList" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:12px"></div>
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn" type="button" data-action="start-top10" style="flex:1">Top 10 Rankings</button>
        <button class="btn" type="button" data-action="show-menu" style="flex:1">Back to Menu</button>
      </div>
    </div>`);
    container.appendChild(list);

    const qList = list.querySelector('#qList');
    quizzes.forEach(q => {
      const card = el(`<div class="card" style="padding:12px;cursor:pointer;border:2px solid rgba(255,255,255,0.06);transition:all 0.2s">
        <strong>${q.title}</strong>
        <div style="color:var(--text-secondary);font-size:0.9rem;margin-top:6px">${q.desc}</div>
        <div style="margin-top:8px;font-size:0.85rem;color:var(--neon-cyan)">${q.questions.length} questions</div>
      </div>`);
      card.addEventListener('click', () => runQuiz(q, container));
      card.addEventListener('mouseover', () => card.style.borderColor = 'var(--neon-cyan)');
      card.addEventListener('mouseout', () => card.style.borderColor = 'rgba(255,255,255,0.06)');
      qList.appendChild(card);
    });

    function runQuiz(quiz, rootContainer) {
      rootContainer.innerHTML = '';

      if (quiz.id === 'career_path') {
        return playCareerPath(quiz, rootContainer);
      }
      if (quiz.id === 'guess_footballer') {
        return playGuessFootballer(quiz, rootContainer);
      }
      const questions = shuffleArray((quiz.questions || []).map(question => ({
        ...question,
        options: Array.isArray(question.options) ? question.options.slice() : question.options
      })));

      const box = el(`<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3>${quiz.title}</h3>
          <div><strong>Score:</strong> <span id="qScore">0</span> / ${questions.length}</div>
        </div>
        <div id="qArea"></div>
        <div id="qControls" style="margin-top:12px;display:flex;gap:8px"><button id="qBack" class="btn">Back</button></div>
      </div>`);
      rootContainer.appendChild(box);
      const item = questions[idx];

      const qArea = box.querySelector('#qArea');
      const qControls = box.querySelector('#qControls');
      const qScore = box.querySelector('#qScore');
      let idx = 0;
      let score = 0;

      function showQuestion() {
        const item = questions[idx];

        // Shuffle options and fix the answer index
        const originalCorrectOpt = item.options[item.a];
        const currentOptions = shuffleArray(item.options.slice());
        const currentA = currentOptions.indexOf(originalCorrectOpt);

        qArea.innerHTML = `<div style="font-weight:700;margin-bottom:12px;font-size:1.05rem">Q${idx + 1}. ${item.q}</div>`;
        const opts = el('<div style="display:flex;flex-direction:column;gap:8px"></div>');
        currentOptions.forEach((op, i) => {
          const b = el(`<button class="btn" style="text-align:left">${op}</button>`);
          b.addEventListener('click', () => {
            if (i === currentA) {
              score++;
              qScore.textContent = score;
              b.style.borderColor = 'var(--neon-green)';
              b.style.color = 'var(--neon-green)';
            } else {
              b.style.borderColor = '#ff6b6b';
              b.style.color = '#ff6b6b';
            }
            Array.from(opts.querySelectorAll('button')).forEach(x => x.disabled = true);
            setTimeout(() => {
              idx++;
              if (idx < questions.length) showQuestion();
              else showResult();
            }, 800);
          });
          opts.appendChild(b);
        });
        qArea.appendChild(opts);
        qControls.innerHTML = `<button id="qBack" class="btn">Back</button><div style="color:var(--text-secondary);flex:1;text-align:right">Question ${idx + 1} of ${questions.length}</div>`;
        box.querySelector('#qBack').addEventListener('click', () => window.startPlanetQuizzes());
      }

      function showResult() {
        const pct = Math.round((score / questions.length) * 100);
        qArea.innerHTML = `<div style="text-align:center;padding:20px">
          <h4 style="font-size:1.8rem">Quiz Complete!</h4>
          <div style="font-size:2rem;margin:12px 0"><span style="color:var(--neon-green);font-weight:700">${score}</span> / ${questions.length} (${pct}%)</div>
          <div style="color:var(--text-secondary);margin:12px 0">${pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : pct >= 40 ? 'Keep practicing!' : 'Try again!'}</div>
        </div>`;
        qControls.innerHTML = `<button id="qRetry" class="btn">Retry</button> <button id="qBack" class="btn">Back</button>`;
        box.querySelector('#qRetry').addEventListener('click', () => runQuiz(quiz, rootContainer));
        box.querySelector('#qBack').addEventListener('click', () => window.startPlanetQuizzes());
      }
      const shuffled = shuffleArray(ranking.items).slice(0, 3);

      showQuestion();
    }

    function playCareerPath(quiz, rootContainer) {
      rootContainer.innerHTML = '';

      const careerPaths = [
        { answer: 'Cristiano Ronaldo', clubs: ['Sporting CP', 'Manchester United', 'Real Madrid', 'Juventus', 'Al Nassr'] },
        { answer: 'Lionel Messi', clubs: ['Barcelona', 'Paris Saint-Germain', 'Inter Miami'] },
        { answer: 'Neymar Jr.', clubs: ['Santos', 'Barcelona', 'Paris Saint-Germain', 'Barcelona'] },
        { answer: 'Zinedine Zidane', clubs: ['Cannes', 'Bordeaux', 'Juventus', 'Real Madrid'] },
        { answer: 'David Beckham', clubs: ['Manchester United', 'Real Madrid', 'LA Galaxy', 'AC Milan'] },
        { answer: 'Pelé', clubs: ['Santos', 'New York Cosmos', 'Santos'] },
        { answer: 'Diego Maradona', clubs: ['Argentinos Juniors', 'Boca Juniors', 'Napoli', 'Sevilla', 'Newell\'s Old Boys'] },
        { answer: 'Ronaldo (Brazilian)', clubs: ['Cruzeiro', 'PSV Eindhoven', 'Barcelona', 'Inter Milan', 'Real Madrid'] },
        { answer: 'Ronaldinho', clubs: ['Gremio', 'Paris Saint-Germain', 'Barcelona', 'AC Milan', 'Flamengo'] },
        { answer: 'Luis Suárez', clubs: ['Nacional', 'Groningen', 'Ajax', 'Liverpool', 'Barcelona', 'Atlético Madrid'] }
      ];

      const shuffled = careerPaths.sort(() => Math.random() - 0.5).slice(0, 3);
      let currentRound = 0;
      let totalScore = 0;
      let lives = 3;

      function playRound() {
        if (currentRound >= shuffled.length || lives <= 0) {
          showSessionEnd();
          return;
        }

        rootContainer.innerHTML = '';
        const player = shuffled[currentRound];
        let roundScore = 100;
        let clubsRevealed = 1;
        let gameEnded = false;

        const box = el(`<div class="card" style="position:relative">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.1)">
            <div style="display:flex;align-items:center;gap:12px">
              <button class="btn" type="button" data-action="start-planet-quizzes" style="padding:4px 12px;font-size:0.9rem">← Back</button>
              <div><strong>Round ${currentRound + 1} of 3</strong></div>
            </div>
            <div style="display:flex;gap:8px;align-items:center">
              <div style="display:flex;gap:4px">Lives: ${lives}</div>
              <div style="color:var(--neon-cyan)"><strong>Score: ${roundScore}</strong></div>
            </div>
          </div>

          <div style="display:flex;gap:16px;margin-bottom:16px">
            <div style="display:flex;flex-direction:column;gap:8px;min-width:80px;align-items:center">
              ${Array.from({ length: player.clubs.length }, (_, i) => `
                <div style="display:flex;flex-direction:column;align-items:center">
                  <div style="width:12px;height:12px;border-radius:50%;background:${i < clubsRevealed ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.2)'};border:2px solid rgba(255,255,255,0.3);margin-bottom:4px"></div>
                  ${i < clubsRevealed ? `<div style="font-size:0.75rem;color:var(--text-secondary)">CLUB ${i + 1}</div>` : ''}
                </div>
              `).join('')}
            </div>

            <div style="flex:1">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <strong>Career Timeline</strong>
                <span style="font-size:0.9rem;color:var(--neon-cyan)">Clubs revealed: ${clubsRevealed}/${player.clubs.length}</span>
              </div>
              <div id="clubsList" style="display:flex;flex-direction:column;gap:8px"></div>
            </div>
          </div>

          <div style="margin:16px 0;padding:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px">
            <input id="playerGuess" placeholder="Who am I?" style="width:100%;padding:10px;border-radius:6px;border:1px solid var(--neon-cyan);background:rgba(0,255,255,0.05);color:#fff">
          </div>

          <div style="display:flex;gap:8px;margin-bottom:12px">
            <button id="submitGuess" class="btn" style="flex:1">Submit Guess</button>
            <button id="revealClub" class="btn"> Reveal Next Club (${Math.max(50, roundScore - 15)} pts)</button>
          </div>

          <div id="feedback" style="font-weight:700;margin-bottom:12px;min-height:20px"></div>
        </div>`);
        rootContainer.appendChild(box);

        const clubsList = box.querySelector('#clubsList');
        const playerGuess = box.querySelector('#playerGuess');
        const submitGuess = box.querySelector('#submitGuess');
        const revealClub = box.querySelector('#revealClub');
        const feedback = box.querySelector('#feedback');

        function displayClubs() {
          clubsList.innerHTML = '';
          for (let i = 0; i < player.clubs.length; i++) {
            const isRevealed = i < clubsRevealed;
            const clubEl = el(`<div style="padding:10px 12px;border-radius:6px;background:${isRevealed ? 'rgba(57,255,20,0.1)' : 'rgba(255,255,255,0.02)'};border:1px solid ${isRevealed ? 'var(--neon-green)' : 'rgba(255,255,255,0.1)'};color:${isRevealed ? 'var(--neon-green)' : 'var(--text-secondary)'};font-size:0.95rem">${isRevealed ? player.clubs[i] : '??? (Hidden)'}</div>`);
            clubsList.appendChild(clubEl);
          }
        }

        function checkGuess() {
          if (gameEnded) return;
          gameEnded = true;

          const guess = playerGuess.value.trim().toLowerCase();
          const answer = player.answer.toLowerCase();
          const nameParts = answer.split(' ');

          const isCorrect = guess === answer ||
            nameParts.some(part => guess === part.toLowerCase());

          if (isCorrect) {
            feedback.innerHTML = `<span style="color:var(--neon-green)">✓ Correct! It was ${player.answer}. +${roundScore} pts!</span>`;
            totalScore += roundScore;
            submitGuess.disabled = true;
            revealClub.disabled = true;
            setTimeout(() => { currentRound++; playRound(); }, 1500);
          } else {
            feedback.innerHTML = `<span style="color:#ff6b6b">✗ Wrong! It was ${player.answer}.</span>`;
            lives--;
            submitGuess.disabled = true;
            revealClub.disabled = true;
            setTimeout(() => { currentRound++; playRound(); }, 1500);
          }
        }

        function revealNextClub() {
          if (clubsRevealed < player.clubs.length) {
            const penalty = Math.max(15, roundScore > 50 ? 15 : 10);
            roundScore = Math.max(50, roundScore - penalty);
            clubsRevealed++;
            displayClubs();
            revealClub.textContent = ` Reveal Next Club (${Math.max(50, roundScore - 15)} pts)`;
            feedback.innerHTML = `<span style="color:var(--neon-cyan)">Club revealed! Score: -${penalty} pts</span>`;
            setTimeout(() => feedback.innerHTML = '', 2000);
          } else {
            feedback.innerHTML = `<span style="color:var(--text-secondary)">All clubs revealed! Make your guess.</span>`;
          }
        }

        displayClubs();
        submitGuess.addEventListener('click', checkGuess);
        playerGuess.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !gameEnded) checkGuess(); });
        revealClub.addEventListener('click', revealNextClub);
      }

      function showSessionEnd() {
        rootContainer.innerHTML = '';
        const finalBox = el(`<div class="card">
          <div style="text-align:center;padding:20px">
            <h3 style="font-size:1.8rem;margin-bottom:16px">Session Complete!</h3>
            <div style="font-size:2rem;margin:12px 0"><span style="color:var(--neon-cyan);font-weight:700">${totalScore}</span> <span style="color:var(--text-secondary)">Total Points</span></div>
            <div style="color:var(--text-secondary);margin:12px 0">${totalScore >= 270 ? 'Perfect!' : totalScore >= 200 ? 'Excellent!' : totalScore >= 150 ? 'Good!' : 'Keep practicing!'}</div>
            <div style="margin-top:20px;display:flex;gap:8px;justify-content:center">
              <button class="btn" type="button" data-action="start-planet-quizzes">Play Again</button>
              <button class="btn" type="button" data-action="show-menu">Back to Menu</button>
            </div>
          </div>
        </div>`);
        rootContainer.appendChild(finalBox);
      }

      playRound();
    }

    function playGuessFootballer(quiz, rootContainer) {
      rootContainer.innerHTML = '';

      const contests = [
        {
          name: 'Cristiano Ronaldo',
          hints: [
            'Played in La Liga for 9 years (2009-2018)',
            'All-time top scorer in international football with 130+ goals',
            'Won 5 Ballon d\'Or awards',
            '5-time UEFA Champions League winner',
            'Currently plays for Saudi Arabia\'s Al Nassr'
          ]
        },
        {
          name: 'Lionel Messi',
          hints: [
            'Spent most career at Barcelona (2004-2021)',
            'Won 8 Ballon d\'Or awards',
            'Led Argentina to 2022 FIFA World Cup victory',
            'Nicknamed "La Pulga" (The Flea)',
            'Now plays for Inter Miami in MLS'
          ]
        },
        {
          name: 'Neymar Jr.',
          hints: [
            'Played for Barcelona in the MSN trio',
            'Transferred to Paris Saint-Germain for world record €222 million',
            'Brazilian national team star',
            'Known for dribbling skills and flair',
            'Has played for Santos, Barca, PSG, Barcelona, and Al-Hilal'
          ]
        },
        {
          name: 'Kylian Mbappe',
          hints: [
            'Won FIFA World Cup with France at age 19 (2018)',
            'Played for AS Monaco before joining PSG',
            'Known for exceptional pace and agility',
            'Records multiple goal records in Ligue 1',
            'Won 2 Ligue 1 titles with Paris Saint-Germain'
          ]
        },
        {
          name: 'Zinedine Zidane',
          hints: [
            'Won FIFA World Cup with France in 1998',
            'Legendary midfielder with incredible technique',
            'Scored iconic Champions League final goal in 2002 for Real Madrid',
            'Later became legendary Real Madrid coach',
            'Won Ballon d\'Or in 1998'
          ]
        }
      ];

      const shuffled = contests.sort(() => Math.random() - 0.5).slice(0, 3);
      let currentRound = 0;
      let sessionScore = 0;

      function playRound() {
        if (currentRound >= shuffled.length) {
          showSessionEnd();
          return;
        }

        rootContainer.innerHTML = '';
        const contestant = shuffled[currentRound];
        let roundScore = 100;
        let hintsUsed = 1;
        let gameEnded = false;

        const box = el(`<div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.1)">
            <div style="display:flex;align-items:center;gap:12px">
              <button class="btn" type="button" data-action="start-planet-quizzes" style="padding:4px 12px;font-size:0.9rem">← Back</button>
              <div><strong>Guess the Footballer #${currentRound + 1}</strong></div>
            </div>
            <div style="display:flex;gap:12px;align-items:center">
              <div style="color:var(--neon-cyan);font-weight:700">Score: <span id="roundScore">${roundScore}</span></div>
              <div style="color:var(--text-secondary)">Hints: <span id="hintsUsed">${hintsUsed}</span> / 5</div>
            </div>
          </div>

          <div id="hintsArea" style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px"></div>

          <div style="margin:16px 0;padding:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px">
            <input id="playerGuess" placeholder="Who am I?" style="width:100%;padding:10px;border-radius:6px;border:1px solid var(--neon-cyan);background:rgba(0,255,255,0.05);color:#fff">
          </div>

          <div style="display:flex;gap:8px;margin-bottom:12px">
            <button id="submitGuess" class="btn" style="flex:1">Submit Guess</button>
            <button id="revealHint" class="btn">Reveal Next Hint (-15 pts)</button>
          </div>

          <div id="feedback" style="font-weight:700;margin-bottom:12px;min-height:20px"></div>
        </div>`);
        rootContainer.appendChild(box);

        const hintsArea = box.querySelector('#hintsArea');
        const playerGuess = box.querySelector('#playerGuess');
        const submitGuess = box.querySelector('#submitGuess');
        const revealHint = box.querySelector('#revealHint');
        const feedback = box.querySelector('#feedback');
        const roundScoreEl = box.querySelector('#roundScore');
        const hintsUsedEl = box.querySelector('#hintsUsed');

        function displayHints() {
          hintsArea.innerHTML = '';
          for (let i = 0; i < contestant.hints.length; i++) {
            const isRevealed = i < hintsUsed;
            const hintEl = el(`<div style="padding:10px 12px;border-radius:6px;background:${isRevealed ? 'rgba(57,255,20,0.1)' : 'rgba(255,255,255,0.02)'};border:1px solid ${isRevealed ? 'var(--neon-green)' : 'rgba(255,255,255,0.1)'};color:${isRevealed ? 'var(--neon-green)' : 'var(--text-secondary)'};font-size:0.95rem">
              <div style="font-size:0.8rem;opacity:0.7">HINT ${i + 1}</div>
              ${isRevealed ? contestant.hints[i] : '??? (Hidden)'}
            </div>`);
            hintsArea.appendChild(hintEl);
          }
        }

        function checkGuess() {
          if (gameEnded) return;
          gameEnded = true;

          const guess = playerGuess.value.trim().toLowerCase();
          const answer = contestant.name.toLowerCase();
          const nameParts = answer.split(' ');

          const isCorrect = guess === answer ||
            nameParts.some(part => guess === part.toLowerCase());

          if (isCorrect) {
            feedback.innerHTML = `<span style="color:var(--neon-green)">Correct! It was ${contestant.name}. +${roundScore} pts!</span>`;
            sessionScore += roundScore;
            submitGuess.disabled = true;
            revealHint.disabled = true;
            setTimeout(() => { currentRound++; playRound(); }, 1500);
          } else {
            feedback.innerHTML = `<span style="color:#ff6b6b">Wrong! It was ${contestant.name}.</span>`;
            submitGuess.disabled = true;
            revealHint.disabled = true;
            setTimeout(() => { currentRound++; playRound(); }, 1500);
          }
        }

        function revealNextHint() {
          if (hintsUsed < contestant.hints.length) {
            roundScore = Math.max(50, roundScore - 15);
            hintsUsed++;
            roundScoreEl.textContent = roundScore;
            hintsUsedEl.textContent = hintsUsed;
            displayHints();
            revealHint.textContent = `Reveal Next Hint (-15 pts)`;
            feedback.innerHTML = `<span style="color:var(--neon-cyan)">Hint revealed! Score: ${roundScore}</span>`;
            setTimeout(() => feedback.innerHTML = '', 2000);
          } else {
            feedback.innerHTML = `<span style="color:var(--text-secondary)">All hints revealed! Make your guess.</span>`;
          }
        }

        displayHints();
        submitGuess.addEventListener('click', checkGuess);
        playerGuess.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !gameEnded) checkGuess(); });
        revealHint.addEventListener('click', revealNextHint);
      }

      function showSessionEnd() {
        rootContainer.innerHTML = '';
        const finalBox = el(`<div class="card">
          <div style="text-align:center;padding:20px">
            <h3 style="font-size:1.8rem;margin-bottom:16px">Session Complete! 🏆</h3>
            <div style="font-size:2rem;margin:12px 0"><span style="color:var(--neon-cyan);font-weight:700">${sessionScore}</span> <span style="color:var(--text-secondary)">Total Points</span></div>
            <div style="color:var(--text-secondary);margin:12px 0">${sessionScore >= 270 ? 'Perfect!' : sessionScore >= 200 ? 'Excellent!' : sessionScore >= 150 ? 'Good!' : 'Keep practicing!'}</div>
            <div style="margin-top:20px;display:flex;gap:8px;justify-content:center">
              <button class="btn" type="button" data-action="start-planet-quizzes">Back to Quizzes</button>
            </div>
          </div>
        </div>`);
        rootContainer.appendChild(finalBox);
      }

      playRound();
    }
  };

  const rankingWikiCache = new Map();

  function normalizeGuess(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/\([^)]*\)/g, ' ')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeRegExp(text) {
    return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function stripAnswerText(text, item) {
    let result = String(text || '').replace(/\s+/g, ' ').trim();
    const baseNames = [item && item.answer, item && item.wikiTitle].filter(Boolean);

    let wordsToRemove = new Set();
    baseNames.forEach(name => {
      // Add the full name
      wordsToRemove.add(name);

      // Clean parentheses from name "Raúl (footballer)" -> "Raúl"
      const cleanName = name.replace(/\([^)]*\)/g, '').trim();
      wordsToRemove.add(cleanName);

      // Split into parts and add individual words > 2 chars
      cleanName.split(/[\s-]+/).forEach(part => {
        const cleanPart = part.replace(/[^a-zA-ZÀ-ÿ]/g, '');
        if (cleanPart.length > 2) {
          wordsToRemove.add(cleanPart);
          // Also without accents
          wordsToRemove.add(cleanPart.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }
      });
    });

    // Sort by length so we replace longer strings first (e.g. 'Cristiano Ronaldo' before 'Ronaldo')
    const namesToRemove = Array.from(wordsToRemove).sort((a, b) => b.length - a.length);

    namesToRemove.forEach(name => {
      if (name.length > 2) { // only suppress meaningful names
        const escaped = escapeRegExp(name);
        result = result.replace(new RegExp(escaped, 'gi'), '_____');
      }
    });

    // Clean up multiple blanks into a single one
    return result.replace(/(_____\s*)+/g, '_____ ').trim();
  }

  function isUsefulHint(text, item) {
    const cleaned = stripAnswerText(text, item);
    if (!cleaned) return false;

    const normalizedCleaned = normalizeGuess(cleaned);
    const answerParts = [item && item.answer, item && item.wikiTitle].filter(Boolean).map(normalizeGuess);
    return !answerParts.some(part => part && normalizedCleaned.includes(part));
  }

  function buildWikiHints(summary, item) {
    const hints = [];

    if (summary) {
      if (summary.description && isUsefulHint(summary.description, item)) {
        hints.push(stripAnswerText(summary.description, item));
      }

      if (summary.extract) {
        const cleanExtract = summary.extract.replace(/\s+/g, ' ').trim();
        const firstSentence = cleanExtract.split(/(?<=[.!?])\s+/)[0];
        const firstSentenceHint = stripAnswerText(firstSentence, item);
        if (firstSentenceHint && isUsefulHint(firstSentenceHint, item)) hints.push(firstSentenceHint);

        if (cleanExtract && cleanExtract !== firstSentence) {
          const shortened = cleanExtract.length > 170 ? `${cleanExtract.slice(0, 170).trim()}...` : cleanExtract;
          const shortenedHint = stripAnswerText(shortened, item);
          if (shortenedHint && isUsefulHint(shortenedHint, item)) hints.push(shortenedHint);
        }
      }
    }

    if (item.extraClue) hints.push(stripAnswerText(item.extraClue, item));
    if (item.sourceHint) hints.push(stripAnswerText(item.sourceHint, item));

    return Array.from(new Set(hints.filter(Boolean))).slice(0, 3);
  }

  async function getWikiSummaryCached(title) {
    if (!title) return null;
    if (rankingWikiCache.has(title)) return rankingWikiCache.get(title);

    const summary = await fetchWikiSummary(title);
    rankingWikiCache.set(title, summary);
    return summary;
  }

  window.startTop10 = function () {
    const container = document.getElementById('quizzesContent');
    container.innerHTML = '';
    const rankings = [
      {
        id: 'expensive_transfers',
        title: '🏆 Most Expensive Transfers',
        desc: 'Guess the items from clever hints and reveal them in their correct order.',
        items: [
          { answer: 'Kylian Mbappe', extraClue: 'The crown jewel of Paris, securely locked down after a hefty domestic blockbuster move.' },
          { answer: 'Neymar Jr.', extraClue: 'A transfer saga that broke the market; exchanged Catalonia for the City of Light.' },
          { answer: 'Philippe Coutinho', extraClue: 'Arrived in winter dreaming of Champions League glory, but ironically lifted it while on loan... against his parent club.' },
          { answer: 'João Félix', extraClue: 'A golden boy swapped the Eagles for the mattress makers in a massive gamble.' },
          { answer: 'Antoine Griezmann', extraClue: 'The Decision documentary maker who eventually joined the Blaugrana, only to return home later.' },
          {
            answer: 'Gareth Bale', extraClue: 'The Welsh wizard whose move to the Bernabéu initially eclipsed his idols record.'
          },
          { answer: 'Cristiano Ronaldo', extraClue: 'The Galáctico signing that defined an era and ignited the biggest individual rivalry in history.' },
          { answer: 'Jack Grealish', extraClue: 'The first €100m Englishman, bringing his calves and flair to the Etihad.' },
          { answer: 'Declan Rice', extraClue: 'The midfield enforcer who crossed London for a record-breaking fee to join the Gunners.' },
          { answer: 'Enzo Fernández', extraClue: 'A World Cup breakout star whose move to London went down to the final seconds of deadline day.' }
        ]
      },
      {
        id: 'champions_scorers',
        title: '⚽ Champions League All-Time Top Scorers',
        desc: 'Guess the items from clever hints and reveal them in their correct order.',
        items: [
          { answer: 'Cristiano Ronaldo', extraClue: 'Mr. Champions League himself, synonymous with clutch knockout stage goals.' },
          {
            answer: 'Lionel Messi', extraClue: 'The left-footed magician who tore through Europes elite at Camp Nou.'
          },
          { answer: 'Robert Lewandowski', extraClue: 'A relentless goal machine who terrorized the continent for Bayern.' },
          { answer: 'Karim Benzema', extraClue: 'The ultimate link-up player who aged like fine wine and spearheaded an epic 2022 run.' },
          { answer: 'Raúl', extraClue: 'The Prince of Madrid, the first to truly break modern scoring records before the alien era.' },
          {
            answer: 'Ruud van Nistelrooy', extraClue: 'The lethal Dutchman who practically lived inside the oppositions penalty box.'
          },
          { answer: 'Thomas Müller', extraClue: 'The self-proclaimed Raumdeuter with an awkward but wildly effective style.' },
          { answer: 'Thierry Henry', extraClue: 'The Highbury king whose elegance on the ball translated perfectly to European nights.' },
          { answer: 'Neymar Jr.', extraClue: 'The flair-filled winger who orchestrated the greatest comeback in UCL history.' },
          { answer: 'Alfredo Di Stéfano', extraClue: 'The blonde arrow who conquered Europe five times in a row.' }
        ]
      },
      {
        id: 'ballon_dor_winners',
        title: ' Ballon d’Or Winners',
        desc: 'Guess the items from clever hints and reveal them in their correct order.',
        items: [
          { answer: 'Lionel Messi', extraClue: 'The undisputed king of the award, needing extra shelves to store them all.' },
          { answer: 'Cristiano Ronaldo', extraClue: 'Five golden balls sit in Madeira, testament to unmatched dedication.' },
          { answer: 'Michel Platini', extraClue: 'The elegant Frenchman who dominated the 80s, winning it three times consecutively.' },
          {
            answer: 'Johan Cruyff', extraClue: 'The pioneer of Total Football who fundamentally changed the games philosophy.'
          },
          { answer: 'Marco van Basten', extraClue: 'A swan-like striker whose incredible career was tragically cut short, yet still grabbed three.' },
          { answer: 'Alfredo Di Stéfano', extraClue: 'The engine and soul of the legendary team that won the first five European Cups.' },
          {
            answer: 'Franz Beckenbauer', extraClue: 'Der Kaiser, who proved that even a sweeper can be the worlds absolute best.'
          },
          { answer: 'Kevin Keegan', extraClue: 'The mighty mouse who conquered Europe with Hamburg to claim back-to-back honors.' },
          { answer: 'Karl-Heinz Rummenigge', extraClue: 'The dynamic German forward who dominated the early 80s for Bayern.' },
          { answer: 'Zinedine Zidane', extraClue: 'A balding genius whose majestic 1998 World Cup final performance cemented this award.' }
        ]
      },
      {
        id: 'international_goals',
        title: ' International Goals',
        desc: 'Guess the items from clever hints and reveal them in their correct order.',
        items: [
          { answer: 'Cristiano Ronaldo', extraClue: 'The undisputed king of international goals, still scoring for his country near 40.' },
          { answer: 'Lionel Messi', extraClue: 'Finally brought the World Cup home, quietly climbing to second on this list.' },
          { answer: 'Ali Daei', extraClue: 'The Iranian legend who held the top spot for over a decade before the modern era.' },
          { answer: 'Sunil Chhetri', extraClue: 'The Indian icon who stood shoulder-to-shoulder with the modern greats.' },
          { answer: 'Mokhtar Dahari', extraClue: 'Supermokh, the legendary Malaysian forward who terrorized Asian defenses in the 70s.' },
          { answer: 'Ferenc Puskás', extraClue: 'The galloping major who led the Magical Magyars with a legendary left foot.' },
          {
            answer: 'Romelu Lukaku', extraClue: 'Belgiums unstoppable force, a tank who consistently bullied international defenses.'
          },
          { answer: 'Godfrey Chitalu', extraClue: 'The Zambian great whose staggering 1972 calendar year record remains a debated legend.' },
          { answer: 'Sándor Kocsis', extraClue: 'The man with the golden head, scoring at a mind-boggling rate for Hungary.' },
          { answer: 'Robert Lewandowski', extraClue: 'Polands undisputed talisman and greatest ever export.' }
        ]
      },
      {
        id: 'market_value',
        title: ' Most Valuable Players (Market Value)',
        desc: 'Guess the items from clever hints and reveal them in their correct order.',
        items: [
          { answer: 'Kylian Mbappe', extraClue: 'The Parisian speedster who currently defines the pinnacle of football value.' },
          { answer: 'Erling Haaland', extraClue: 'The robotic Nordic meat-shield who breaks Premier League records for fun.' },
          {
            answer: 'Vinícius Júnior', extraClue: 'The electric winger who went from meme to Madrids main man.'
          },
          { answer: 'Jude Bellingham', extraClue: 'The boy from Birmingham who conquered the Bernabéu in his debut season.' },
          { answer: 'Bukayo Saka', extraClue: 'The starboy of North London, a beacon of light for the Gunners.' },
          { answer: 'Phil Foden', extraClue: 'The Stockport Iniesta, a homegrown gem pulling the strings in sky blue.' },
          { answer: 'Florian Wirtz', extraClue: 'The prodigious German playmaker who orchestrated a historic invincible domestic season.' },
          { answer: 'Jamal Musiala', extraClue: 'Bambi on ice; the silky Bayern dribbler causing defenders nightmares.' },
          { answer: 'Pedri', extraClue: 'The Canarian youngster who evoked immediate comparisons to Iniesta.' },
          { answer: 'Gavi', extraClue: 'The combative, shoelace-ignoring La Masia graduate with incredible tenacity.' }
        ]
      },
      {
        id: 'club_value',
        title: ' Most Expensive Squads (Club)',
        desc: 'Guess the items from clever hints and reveal them in their correct order.',
        items: [
          { answer: 'Manchester City', extraClue: 'Petrodollars, Peps mastermind, and a treble- winning modern dynasty.' },
          { answer: 'Real Madrid', extraClue: 'The kings of Europe, practically collecting superstars like infinity stones.' },
          { answer: 'Paris Saint-Germain', extraClue: 'The Qatari project, built on endless funds and a carousel of global icons.' },
          { answer: 'Manchester United', extraClue: 'The sleeping giant of Old Trafford, perpetually rebuilding but dripping with commercial power.' },
          {
            answer: 'Liverpool', extraClue: 'The Anfield giants reborn under Klopps heavy metal football.'
          },
          { answer: 'Barcelona', extraClue: 'Levers upon levers; navigating financial ruin by relying on the kids of La Masia.' },
          { answer: 'Chelsea', extraClue: 'The pioneers of the endless amortized contract, boasting a bloated but highly valued squad.' },
          { answer: 'Juventus', extraClue: 'The Old Lady of Turin, dominating Italy for a decade before recent courtroom drama.' },
          { answer: 'Arsenal', extraClue: 'The process has been trusted; Artetas young squad is now among the worlds elite.' },
          { answer: 'Tottenham Hotspur', extraClue: 'The pride of North London with a shiny new stadium, though the trophy cabinet remains dusty.' }
        ]
      }
    ];

    const list = el(`<div class="card">
      <h3>Top 10 Rankings</h3>
      <p style="color:var(--text-secondary)">Guess the ranks one by one and score points.</p>
      <div id="qList" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:12px"></div>
      <div style="margin-top:12px"><button class="btn" type="button" data-action="start-planet-quizzes">Back to Quizzes</button></div>
    </div>`);
    container.appendChild(list);

    const qList = list.querySelector('#qList');
    rankings.forEach((ranking, index) => {
      const card = el(`<div class="card" style="padding:12px;cursor:pointer;border:2px solid rgba(255,255,255,0.06);transition:all 0.2s">
        <strong>#${index + 1} ${ranking.title}</strong>
        <div style="color:var(--text-secondary);font-size:0.9rem;margin-top:6px">${ranking.desc}</div>
        <div style="margin-top:8px;font-size:0.85rem;color:var(--neon-cyan)">${ranking.items.length} blind guesses</div>
      </div>`);
      card.addEventListener('click', () => playBlindRanking(ranking, container));
      card.addEventListener('mouseover', () => card.style.borderColor = 'var(--neon-cyan)');
      card.addEventListener('mouseout', () => card.style.borderColor = 'rgba(255,255,255,0.06)');
      qList.appendChild(card);
    });

    async function playBlindRanking(ranking, rootContainer) {
      rootContainer.innerHTML = `<div class="card"><div style="text-align:center;padding:20px;color:var(--neon-cyan)">Loading Game...</div></div>`;

      // pure clever hints, removing Wikipedia
      const rounds = ranking.items.map(item => ({ ...item }));

      let sessionScore = 0;
      let revealedCount = 0;
      const board = Array(rounds.length).fill(false); // boolean array tracking filled slot

      const startTime = Date.now();

      function isCorrectGuess(guess, answer) {
        const normalGuess = normalizeGuess(guess);
        if (!normalGuess) return false;

        const variants = [
          answer,
          answer.replace(/\([^)]*\)/g, '').trim(),
          answer.split(' ')[0], // First name
          answer.split(' ').slice(-1)[0] // Last name
        ]
          .filter(Boolean)
          .map(normalizeGuess);

        return variants.some(variant => variant === normalGuess);
      }

      function renderGame() {
        rootContainer.innerHTML = '';
        const box = el(`<div class="card" style="max-width:860px;margin:0 auto">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.1)">
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
              <button class="btn" type="button" data-action="start-top10" style="padding:4px 12px;font-size:0.9rem">← Back</button>
              <div><strong style="font-size:1.2rem">${ranking.title}</strong></div>
            </div>
            <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
              <div style="color:var(--neon-green);font-weight:700;font-size:1.1rem">Score: <span id="rankScore">${sessionScore}</span></div>
              <div style="color:var(--neon-cyan);font-weight:700;font-size:1.1rem">Revealed: <span id="revealCount">${revealedCount}</span> / ${rounds.length}</div>
            </div>
          </div>

          <div style="margin:0 0 20px 0;padding:16px;border-radius:14px;background:rgba(0,0,0,0.2);border:1px solid rgba(0,255,255,0.15);position:sticky;top:10px;z-index:10;backdrop-filter:blur(8px)">
            <div style="margin-bottom:8px;font-size:0.9rem;color:var(--text-secondary);display:flex;justify-content:space-between">
              <span>Guess any rank at any time!</span>
              <span>Total Points possible: ${rounds.length * 100}</span>
            </div>
            <input id="rankingGuess" placeholder="Type a player/club name..." autocomplete="off" style="width:100%;padding:14px 18px;border-radius:10px;border:2px solid var(--neon-cyan);background:rgba(0,255,255,0.05);color:#fff;font-size:1.2rem;transition:all 0.2s outline:none;box-shadow:0 0 10px rgba(0,255,255,0.1)">
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:14px" id="rankBoard"></div>
          
          <div style="margin-top:20px;text-align:center">
             <button id="giveUpBtn" class="btn" style="background:rgba(255, 107, 107, 0.1);color:#ff6b6b;border-color:#ff6b6b">Give Up & Reveal Answers</button>
          </div>
        </div>`);
        rootContainer.appendChild(box);

        const rankBoard = box.querySelector('#rankBoard');
        const rankingGuess = box.querySelector('#rankingGuess');
        const revealCountEl = box.querySelector('#revealCount');
        const rankScoreEl = box.querySelector('#rankScore');
        const giveUpBtn = box.querySelector('#giveUpBtn');

        function updateBoard() {
          rankBoard.innerHTML = rounds.map((slot, index) => {
            const isFilled = board[index];
            const primaryClue = slot.extraClue || 'Think of a name for this rank.';

            return `<div style="padding:14px 16px;border-radius:14px;border:1px solid ${isFilled ? 'rgba(57,255,20,0.35)' : 'rgba(255,255,255,0.08)'};background:${isFilled ? 'rgba(57,255,20,0.08)' : 'rgba(255,255,255,0.03)'};display:flex;flex-direction:column;gap:8px;min-height:80px;box-shadow:${isFilled ? '0 0 20px rgba(57,255,20,0.12)' : 'none'};transition:all 0.3s">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
                <div style="font-size:1.5rem;font-weight:800;color:${isFilled ? 'var(--neon-green)' : 'rgba(255,255,255,0.2)'};min-width:30px">#${index + 1}</div>
                <div style="flex:1;text-align:left;font-weight:800;font-size:1.2rem;letter-spacing:0.5px;color:${isFilled ? 'var(--neon-green)' : 'var(--text-secondary)'}">${isFilled ? slot.answer : '????????'}</div>
              </div>
              <div style="font-size:0.9rem;color:var(--text-secondary);opacity:${isFilled ? 0.6 : 1}">
                 <div><strong>Hint:</strong> ${primaryClue}</div>
              </div>
            </div>`;
          }).join('');
        }

        function checkInput() {
          const guess = rankingGuess.value.trim();
          if (!guess) return;

          let matchedIndex = -1;
          for (let i = 0; i < rounds.length; i++) {
            if (!board[i] && isCorrectGuess(guess, rounds[i].answer)) {
              board[i] = true;
              matchedIndex = i;
              break;
            }
          }

          if (matchedIndex !== -1) {
            revealedCount++;
            sessionScore += 100;

            // Visual feedback
            rankingGuess.value = '';
            rankingGuess.style.boxShadow = '0 0 15px var(--neon-green), inset 0 0 10px rgba(57,255,20,0.2)';
            rankingGuess.style.borderColor = 'var(--neon-green)';
            setTimeout(() => {
              rankingGuess.style.boxShadow = '0 0 10px rgba(0,255,255,0.1)';
              rankingGuess.style.borderColor = 'var(--neon-cyan)';
            }, 300);

            revealCountEl.textContent = revealedCount;
            rankScoreEl.textContent = sessionScore;
            updateBoard();

            if (revealedCount === rounds.length) {
              rankingGuess.disabled = true;
              giveUpBtn.style.display = 'none';
              setTimeout(showSessionEnd, 1500);
            }
          }
        }

        giveUpBtn.addEventListener('click', () => {
          for (let i = 0; i < board.length; i++) board[i] = true;
          rankingGuess.disabled = true;
          updateBoard();
          giveUpBtn.style.display = 'none';
          setTimeout(showSessionEnd, 2000);
        });

        rankingGuess.addEventListener('input', checkInput);
        updateBoard();
        rankingGuess.focus();
      }

      function showSessionEnd() {
        rootContainer.innerHTML = '';

        const timeTakenMs = Date.now() - startTime;
        const minutes = Math.floor(timeTakenMs / 60000);
        const seconds = Math.floor((timeTakenMs % 60000) / 1000);
        const timeStr = `${minutes}m ${seconds}s`;

        const finalBox = el(`<div class="card" style="max-width:860px;margin:0 auto">
          <div style="text-align:center;padding:30px 20px">
            <h3 style="font-size:2.2rem;margin-bottom:16px;color:var(--neon-green)">Quiz Complete!</h3>
            <div style="font-size:1.3rem;margin-bottom:24px;color:var(--text-secondary)">You revealed <strong>${revealedCount}</strong> out of ${rounds.length} in ${timeStr}</div>
            
            <div style="font-size:2.5rem;margin:12px 0;font-weight:800;color:var(--neon-cyan)">${sessionScore} <span style="font-size:1.2rem;color:var(--text-secondary);font-weight:400">Total Points</span></div>
            
            <div style="margin-top:30px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
              <button class="btn" type="button" data-action="start-top10" style="padding:12px 24px;font-size:1.1rem;background:rgba(0,255,255,0.1)">Play Another Category</button>
              <button class="btn" type="button" data-action="start-planet-quizzes" style="padding:12px 24px;font-size:1.1rem">Back to Quizzes Menu</button>
            </div>
          </div>
        </div>`);
        rootContainer.appendChild(finalBox);
      }

      renderGame();
    }
  };

})();
