export const dnaQuestions = [
  {
    q: "What's your playing style on the field?",
    options: [
      { text: 'Powerhouse — I dominate with strength and speed', traits: { power: 3, flair: 0, leadership: 0, teamwork: 0 } },
      { text: 'Flair — I dazzle with skills and creativity', traits: { power: 0, flair: 3, leadership: 0, teamwork: 0 } },
      { text: 'Balanced — I mix power and finesse', traits: { power: 2, flair: 2, leadership: 0, teamwork: 0 } },
      { text: 'Strategic — I control the game with smart plays', traits: { power: 0, flair: 2, leadership: 1, teamwork: 1 } }
    ]
  },
  {
    q: 'What role do you take in a team?',
    options: [
      { text: 'Leader — I inspire and guide everyone', traits: { power: 0, flair: 0, leadership: 3, teamwork: 1 } },
      { text: 'Team player — I work seamlessly with others', traits: { power: 0, flair: 0, leadership: 1, teamwork: 3 } },
      { text: 'Lone star — I shine on my own', traits: { power: 1, flair: 1, leadership: 2, teamwork: 0 } },
      { text: 'Versatile — I adapt to any role', traits: { power: 1, flair: 1, leadership: 1, teamwork: 1 } }
    ]
  },
  {
    q: "What's your approach to challenges?",
    options: [
      { text: 'Smash through with raw power', traits: { power: 3, flair: 0, leadership: 1, teamwork: 0 } },
      { text: 'Outsmart with creativity and finesse', traits: { power: 0, flair: 3, leadership: 0, teamwork: 1 } },
      { text: 'Lead and rally others to overcome', traits: { power: 0, flair: 0, leadership: 3, teamwork: 2 } },
      { text: 'Stay calm and find a balanced solution', traits: { power: 1, flair: 1, leadership: 1, teamwork: 1 } }
    ]
  },
  {
    q: 'Last minute, your team needs a goal. You...',
    options: [
      { text: 'Demand the ball and shoot from distance', traits: { power: 2, flair: 0, leadership: 2, teamwork: 0 } },
      { text: 'Try a solo run through the defence', traits: { power: 0, flair: 3, leadership: 0, teamwork: 0 } },
      { text: 'Organise the attack for the perfect pass', traits: { power: 0, flair: 0, leadership: 2, teamwork: 2 } },
      { text: 'Wait in the box for the perfect cross', traits: { power: 2, flair: 0, leadership: 0, teamwork: 1 } }
    ]
  },
  {
    q: 'What is your training focus?',
    options: [
      { text: 'Gym and physical conditioning', traits: { power: 3, flair: 0, leadership: 0, teamwork: 1 } },
      { text: 'Skill moves and dribbling mastery', traits: { power: 0, flair: 3, leadership: 0, teamwork: 0 } },
      { text: 'Tactical analysis and positioning', traits: { power: 0, flair: 0, leadership: 2, teamwork: 2 } },
      { text: 'Passing drills and team chemistry', traits: { power: 0, flair: 0, leadership: 1, teamwork: 3 } }
    ]
  },
  {
    q: 'How do you celebrate a goal?',
    options: [
      { text: 'A signature acrobatic move', traits: { power: 1, flair: 3, leadership: 0, teamwork: 0 } },
      { text: 'Run to the fans and scream', traits: { power: 2, flair: 1, leadership: 1, teamwork: 0 } },
      { text: 'Point to the assist provider', traits: { power: 0, flair: 0, leadership: 1, teamwork: 3 } },
      { text: 'Calm, cool, business handled', traits: { power: 0, flair: 1, leadership: 2, teamwork: 1 } }
    ]
  }
];

export const iqCategories = [
  {
    id: 'records',
    title: 'History & Records',
    questions: [
      { q: 'Who is the all-time top scorer in international football?', options: ['Cristiano Ronaldo', 'Ali Daei', 'Lionel Messi', 'Pelé'], a: 0, fact: 'CR7 has passed 130 international goals.' },
      { q: 'How many FIFA World Cups has Brazil won?', options: ['3', '4', '5', '6'], a: 2, fact: '1958, 1962, 1970, 1994 and 2002.' },
      { q: 'Who holds the record for most goals in a single Premier League season?', options: ['Sergio Agüero', 'Harry Kane', 'Erling Haaland', 'Alan Shearer'], a: 2, fact: 'Haaland scored 36 in 2022-23.' },
      { q: 'Which player has won the most Ballon d\'Or awards?', options: ['Cristiano Ronaldo', 'Lionel Messi', 'Pelé', 'Michel Platini'], a: 1, fact: 'Messi has lifted eight golden balls.' },
      { q: 'Who played in the most consecutive international matches unbeaten?', options: ['Spain', 'Brazil', 'Italy', 'Argentina'], a: 1, fact: 'Brazil went 35 matches unbeaten (1993-96).' },
      { q: 'Which club has won the most UEFA Champions League titles?', options: ['Barcelona', 'AC Milan', 'Real Madrid', 'Liverpool'], a: 2, fact: 'Los Blancos own 15 European Cups.' },
      { q: 'Who is the only player to win three World Cups as a player and win 3 as...?', options: ['Pelé', 'Franz Beckenbauer', 'Mario Zagallo', 'Zidane'], a: 3, fact: 'Zidane won 1998 as a player and 2018 as coach; Zagallo did 1958/62 as player, 1970 as coach.' },
      { type: 'truefalse', q: 'Brazil are the only nation to have played at every FIFA World Cup.', options: ['True', 'False'], a: 0, fact: 'Brazil are the only country to have featured in all 22 editions.' },
      { type: 'truefalse', q: 'A goalkeeper has won the Ballon d\'Or.', options: ['True', 'False'], a: 0, fact: 'Lev Yashin won it in 1963 — still the only keeper to do so.' },
      { type: 'order', q: 'Arrange these European Cup wins from earliest to latest.', items: ['Real Madrid 1956', 'Ajax 1971', 'Liverpool 1977'], fact: 'Real 1956, Ajax 1971, Liverpool 1977 — a run spanning the eras.' },
      { type: 'clue', q: 'Who am I?', intel: ['The darling of Naples', 'Captain of the Hand of God side', 'Goal of the Century, 1986'], options: ['Diego Maradona', 'Michel Platini', 'Zico', 'Hugo Sánchez'], a: 0, fact: 'Maradona dragged Argentina and Napoli to the very top.' }
    ]
  },
  {
    id: 'clubs',
    title: 'Clubs & Leagues',
    questions: [
      { q: 'Which club won the first-ever Premier League season (1992-93)?', options: ['Arsenal', 'Manchester United', 'Liverpool', 'Leeds United'], a: 1, fact: 'Fergie\'s first title at Old Trafford.' },
      { q: 'Which club plays at the Camp Nou?', options: ['Real Madrid', 'Barcelona', 'Sevilla', 'Valencia'], a: 1, fact: 'Now officially the "Spotify Camp Nou".' },
      { q: 'Which league has the most teams ever crowned European champions?', options: ['English Premier League', 'Serie A', 'La Liga', 'German Bundesliga'], a: 1, fact: 'Italy: AC Milan, Inter, Juventus have all won it.' },
      { q: 'Which team went unbeaten for an entire Premier League season?', options: ['Manchester City', 'Chelsea', 'Arsenal', 'Manchester United'], a: 2, fact: 'The 2003-04 "Invincibles".' },
      { q: 'Which club is nicknamed "The Old Lady"?', options: ['Roma', 'Juventus', 'Napoli', 'Inter'], a: 1, fact: 'La Vecchia Signora — Juventus.' },
      { q: 'Who is the all-time top scorer in the Premier League?', options: ['Wayne Rooney', 'Harry Kane', 'Alan Shearer', 'Andy Cole'], a: 2, fact: 'Alan Shearer, 260 goals.' },
      { type: 'truefalse', q: 'The Premier League kicked off in 1992.', options: ['True', 'False'], a: 0, fact: 'The top flight was rebranded the Premier League for 1992-93.' },
      { type: 'truefalse', q: 'The Camp Nou is the largest football stadium in Europe.', options: ['True', 'False'], a: 0, fact: 'Barcelona\'s home holds roughly 99,000 fans.' },
      { type: 'order', q: 'Arrange these clubs by founding year (oldest first).', items: ['Manchester United (1878)', 'Juventus (1897)', 'FC Barcelona (1899)'], fact: 'United began life as Newton Heath in 1878.' },
      { type: 'order', q: 'Arrange these Premier League top scorers from fewest goals to most.', items: ['Andy Cole (187)', 'Wayne Rooney (208)', 'Alan Shearer (260)'], fact: 'Shearer\'s 260 still tops the all-time list.' }
    ]
  },
  {
    id: 'legends',
    title: 'Legends',
    questions: [
      { q: 'Which country did Diego Maradona lead to World Cup glory in 1986?', options: ['Brazil', 'Argentina', 'Uruguay', 'Italy'], a: 1, fact: 'Sixty seconds of magic at the Azteca.' },
      { q: 'Who scored the "Goal of the Century" in 1986?', options: ['Pelé', 'Zidane', 'Maradona', 'Lineker'], a: 2, fact: 'Five players beaten on a 60-yard run.' },
      { q: 'Which Italian legend spent 25 years at one club?', options: ['Baggio', 'Maldini', 'Del Piero', 'Totti'], a: 1, fact: 'Paolo Maldini — AC Milan, 1985-2009.' },
      { q: 'Who is the top scorer in UEFA Champions League history?', options: ['Lionel Messi', 'Cristiano Ronaldo', 'Robert Lewandowski', 'Raúl'], a: 1, fact: 'CR7 has 140+ Champions League goals.' },
      { q: 'Which Dutch legend created "Total Football"?', options: ['Van Basten', 'Cruyff', 'Bergkamp', 'Gullit'], a: 1, fact: 'Johan Cruyff, with Rinus Michels.' },
      { q: 'Who headed home the winner in the 2006 Champions League final?', options: ['Sol Campbell', 'Belletti', 'Larsson', 'Eto\'o'], a: 1, fact: 'Belletti won it for Barcelona vs Arsenal.' },
      { type: 'truefalse', q: 'Johan Cruyff won a FIFA World Cup.', options: ['True', 'False'], a: 1, fact: 'His Netherlands lost the 1974 final to West Germany.' },
      { type: 'truefalse', q: 'Paolo Maldini never lifted the World Cup.', options: ['True', 'False'], a: 0, fact: 'Italy lost the 1994 final and bowed out in 1998 and 2002.' },
      { type: 'order', q: 'Arrange these strikers by international goals (fewest to most).', items: ['Robin van Persie (50)', 'Thierry Henry (51)', 'Cristiano Ronaldo (130+)'], fact: 'Ronaldo owns the all-time international record.' },
      { type: 'clue', q: 'Who am I?', intel: ['A Dutch total footballer', 'Three-time Ballon d\'Or winner', 'Never won a World Cup'], options: ['Johan Cruyff', 'Ruud Gullit', 'Marco van Basten', 'Frank Rijkaard'], a: 0, fact: 'Cruyff redefined what number 14 could be.' }
    ]
  },
  {
    id: 'finals',
    title: 'Epic Finals',
    questions: [
      { q: 'Which team won the 1999 Champions League final with two stoppage-time goals?', options: ['Bayern Munich', 'Manchester United', 'Real Madrid', 'Barcelona'], a: 1, fact: 'Sheringham and Solskjær broke Bayern hearts.' },
      { q: 'Who scored a "panenka" penalty in the 2006 World Cup final?', options: ['Materazzi', 'Zidane', 'Thierry Henry', 'Pirlo'], a: 1, fact: 'Zidane chipped Buffon before the head-butt.' },
      { q: 'What was the score when Liverpool beat AC Milan in the 2005 Istanbul final?', options: ['2-1', '6-5 on penalties', '3-0', '4-2'], a: 1, fact: '3-3 after 90, Liverpool won on penalties.' },
      { q: 'Which country hosted the first World Cup in 1930?', options: ['Italy', 'France', 'Uruguay', 'Brazil'], a: 2, fact: 'Uruguay won it on home soil.' },
      { q: 'Who won Euro 2016?', options: ['France', 'Portugal', 'Germany', 'Spain'], a: 1, fact: 'Éder\'s thunderbolt swung the final Portugal\'s way.' },
      { q: 'Which player scored 3 goals in a World Cup final — a first?', options: ['Mbappé', 'Hurricane', 'Hurst', 'Ronaldo'], a: 2, fact: 'Geoff Hurst\'s 1966 hat-trick remains unique.' },
      { type: 'truefalse', q: 'The 1966 World Cup final went to extra time.', options: ['True', 'False'], a: 0, fact: 'Geoff Hurst\'s hat-trick was completed deep into the extra period.' },
      { type: 'truefalse', q: 'Denmark won Euro 92 without qualifying for it.', options: ['True', 'False'], a: 0, fact: 'They replaced Yugoslavia at short notice and lifted the trophy.' },
      { type: 'order', q: 'Arrange these World Cup hosts by year (oldest first).', items: ['Uruguay 1930', 'Italy 1934', 'France 1938'], fact: 'The first three editions, all staged before the war.' },
      { type: 'clue', q: 'Who am I?', intel: ['Hat-trick hero of a World Cup final', '1966 English icon', 'Scored in every round that summer'], options: ['Geoff Hurst', 'Bobby Charlton', 'Roger Hunt', 'Jimmy Greaves'], a: 0, fact: 'Hurst\'s final treble remains one of a kind.' }
    ]
  },
  {
    id: 'tactics',
    title: 'Tactics & Formations',
    questions: [
      { q: 'Which tactic involves pressing opponents high up the pitch?', options: ['Gegenpressing', 'Parking the Bus', 'Low Block', 'Catenaccio'], a: 0, fact: 'The Klopp signature — win it back in 5 seconds.' },
      { q: 'What is the 2-3-5 formation also known as?', options: ['The Pyramid', 'The Boxing Day', 'The Diamond', 'The W-M'], a: 0, fact: 'The classic pyramid of early 1900s football.' },
      { q: 'Who famously used tiki-taka at Barcelona?', options: ['Mourinho', 'Ancelotti', 'Pep Guardiola', 'Klopp'], a: 2, fact: 'Positional play, triangles, total control.' },
      { q: 'Which defensive approach = compact block near your own goal?', options: ['Gegenpress', 'Parking the Bus', 'Offside trap', 'Rocket ball'], a: 1, fact: 'Perfect for killing a lead late on.' },
      { q: 'Which formation became the default for modern possession teams?', options: ['4-4-2', '4-3-3', '3-4-1-2', '5-5-0'], a: 1, fact: 'The 4-3-3 dominates modern football.' },
      { q: 'A "libero" is also known as?', options: ['Striker', 'Sweeper', 'Winger', 'Keeper'], a: 1, fact: 'Beckenbauer made the sweeper legendary.' },
      { type: 'truefalse', q: 'Gegenpressing means defending ultra-deep in your own box.', options: ['True', 'False'], a: 1, fact: 'It\'s the aggressive art of winning the ball back high up the pitch.' },
      { type: 'truefalse', q: 'A "false nine" is a striker who drops deep to drag defenders out.', options: ['True', 'False'], a: 0, fact: 'Messi and Firmino made the role famous.' },
      { type: 'order', q: 'Arrange these tactical ideas by era (oldest first).', items: ['The Pyramid 2-3-5', 'Catenaccio', 'Gegenpressing'], fact: 'From the 1900s pyramid to Klopp\'s rock-and-roll.' },
      { type: 'clue', q: 'Who am I?', intel: ['A libero who attacked like a playmaker', 'World Cup-winning captain in 1974', 'Known as Der Kaiser'], options: ['Franz Beckenbauer', 'Bobby Moore', 'Franco Baresi', 'Paolo Maldini'], a: 0, fact: 'Beckenbauer liberated the sweeper position.' }
    ]
  }
];