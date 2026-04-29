const footballers = [
      {
        name: "Erling Haaland",
        image: "https://images.teamtalk.com/content/uploads/2022/10/02160859/erling-haaland-man-city-2022.jpg",
        position: "Forward",
        bio: "Norwegian striking sensation known for his immense speed, strength, and an insane goal-scoring record, defining a new generation of centre-forwards.",
        achievements: ["2x Premier League Golden Boot", "UEFA Champions League Winner", "Premier League Champion"],
        traits: { power: 3, flair: 1, leadership: 2, teamwork: 2 }
      },
      {
        name: "Lionel Messi",
        image: "https://s.france24.com/media/display/451ed2b8-eed6-11ea-afdd-005056bf87d6/w:1280/p:4x3/messi-1805.jpg",
        position: "Forward",
        bio: "The Argentine magician, widely regarded as the greatest player of all time, known for his dribbling, vision, and prolific goal-scoring from the right wing.",
        achievements: ["8x Ballon d'Or Winner", "FIFA World Cup Champion (2022)", "4x UEFA Champions League Winner"],
        traits: { power: 1, flair: 3, leadership: 2, teamwork: 3 }
      },
      {
        name: "Kylian Mbappé",
        image: "https://cdn.antaranews.com/cache/1200x800/2022/03/13/PSG-17601.jpg.webp",
        position: "Forward",
        bio: "A French speedster and generational talent known for his blistering pace and clinical finishing, leading the next era of global football.",
        achievements: ["FIFA World Cup Champion (2018)", "6x Ligue 1 Champion", "World Cup Final Hat-trick (2022)"],
        traits: { power: 2, flair: 2, leadership: 1, teamwork: 2 }
      },
      {
        name: "Cristiano Ronaldo",
        image: "https://gymnation.com/media/bgjgtc1d/cr7-2008.jpg",
        position: "Forward",
        bio: "The Portuguese legend, an iconic global superstar known for his unmatched athleticism, aerial ability, and relentless pursuit of goals and records.",
        achievements: ["5x Ballon d'Or Winner", "5x UEFA Champions League Winner", "European Championship Winner (2016)"],
        traits: { power: 3, flair: 1, leadership: 3, teamwork: 1 }
      },
      {
        name: "Pelé",
        image: "https://static01.nyt.com/images/2022/12/22/multimedia/00pele-photos-1-32de/00pele-photos-1-32de-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
        position: "Forward",
        bio: "The Brazilian 'King,' a global icon who remains the only player in history to win three FIFA World Cups, revolutionizing the sport with his flair and athleticism.",
        achievements: ["3x FIFA World Cup Winner", "FIFA Player of the Century", "Guinness World Record for career goals"],
        traits: { power: 2, flair: 3, leadership: 2, teamwork: 3 }
      },
      {
        name: "Diego Maradona",
        image: "https://i.pinimg.com/564x/f2/9b/ae/f29baed184ebf3c6fa25d82fc259d873.jpg",
        position: "Attacking Midfielder",
        bio: "The unforgettable Argentine creative genius, famous for the 'Hand of God' goal and single-handedly leading Argentina to World Cup glory in 1986.",
        achievements: ["FIFA World Cup Champion (1986)", "2x Serie A Champion", "FIFA Goal of the Century"],
        traits: { power: 1, flair: 3, leadership: 3, teamwork: 2 }
      },
      {
        name: "Paolo Maldini",
        image: "https://wallpapers.com/images/featured/paolo-maldini-iqin5cg83r7uncx0.jpg",
        position: "Defender",
        bio: "The AC Milan legend, regarded as one of the greatest and most versatile defenders ever. He epitomized loyalty, spending his entire 25-year career with the club.",
        achievements: ["5x UEFA Champions League Winner", "7x Serie A Champion", "AC Milan All-Time Appearance Leader"],
        traits: { power: 1, flair: 1, leadership: 3, teamwork: 3 }
      },
      {
        name: "Zinedine Zidane",
        image: "https://assets.realmadrid.com/is/image/realmadrid/1330190795142?$Mobile$&fit=wrap",
        position: "Midfielder",
        bio: "French midfield genius, famous for his sublime control and elegance. He scored twice in the 1998 World Cup final and the iconic 2002 Champions League final winner.",
        achievements: ["FIFA World Cup Champion (1998)", "Ballon d'Or Winner (1998)", "UEFA Champions League Winner"],
        traits: { power: 1, flair: 3, leadership: 2, teamwork: 2 }
      },
      {
        name: "Karim Benzema",
        image: "https://www.shutterstock.com/editorial/image-editorial/MdTdA513N1zaA6y8MDkxMzA=/karim-benzema-real-madrid-celebrates-scoring-opening-440nw-10484600u.jpg",
        position: "Forward",
        bio: "The intelligent and lethal French striker who blossomed into a 2022 Ballon d'Or winner, known for his link-up play and clinical finishing for Real Madrid.",
        achievements: ["Ballon d'Or Winner (2022)", "5x UEFA Champions League Winner", "4x Ligue 1 Champion"],
        traits: { power: 2, flair: 2, leadership: 2, teamwork: 3 }
      },
      {
        name: "Wayne Rooney",
        image: "https://a.espncdn.com/photo/2020/0304/r674744_1296x1296_1-1.jpg",
        position: "Forward",
        bio: "Manchester United's all-time top scorer, a fierce competitor, and a powerful forward known for his incredible work rate and versatility across the attack.",
        achievements: ["Manchester United All-Time Top Scorer", "5x Premier League Winner", "UEFA Champions League Winner (2008)"],
        traits: { power: 3, flair: 1, leadership: 2, teamwork: 2 }
      },
      {
        name: "Ronaldinho",
        image: "https://64.media.tumblr.com/df916c4a2d45fecbc9a9897b390b9abb/tumblr_oyyh59qk7A1wnzah8o3_1280.jpg",
        position: "Attacking Midfielder",
        bio: "The Brazilian wizard, loved globally for his flair, mesmerizing tricks, and infectious smile. He defined an era of joyous, free-flowing football.",
        achievements: ["Ballon d'Or Winner (2005)", "FIFA World Cup Champion (2002)", "UEFA Champions League Winner"],
        traits: { power: 1, flair: 3, leadership: 1, teamwork: 2 }
      },
      {
        name: "David Beckham",
        image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/David_Beckham_2019.jpg",
        position: "Midfielder",
        bio: "England star and a global fashion icon, famous for his lethal free-kicks, pinpoint crossing, and exceptional range of passing from the right flank.",
        achievements: ["6x Premier League Winner", "UEFA Champions League Winner (1999)", "First Englishman to win titles in four countries"],
        traits: { power: 1, flair: 2, leadership: 2, teamwork: 3 }
      },
      {
        name: "Neymar Jr.",
        image: "https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/7f5c/live/d265d420-de30-11ef-ac5a-93e8b29ec95c.jpg",
        position: "Forward",
        bio: "Brazilian dribbler known for his incredible flair, mesmerizing skills, and trickery. One of the most gifted and entertaining players of his generation.",
        achievements: ["Copa Libertadores Winner", "UEFA Champions League Winner", "Olympic Gold Medalist"],
        traits: { power: 1, flair: 3, leadership: 1, teamwork: 2 }
      },
      {
        name: "Andrés Iniesta",
        image: "https://i.pinimg.com/1200x/0b/f4/8d/0bf48d5b0ea8ba1a7bbeead314a82779.jpg",
        position: "Midfielder",
        bio: "Spain’s midfield brain, a master of control and passing. He scored the iconic 2010 World Cup winning goal and was a central figure in Barcelona's greatest era.",
        achievements: ["FIFA World Cup Champion (2010)", "4x UEFA Champions League Winner", "9x La Liga Champion"],
        traits: { power: 1, flair: 2, leadership: 2, teamwork: 3 }
      },
      {
        name: "Xavi Hernández",
        image: "https://www.fcbarcelona.com/photo-resources/2019/03/12/62f67c7f-28fa-49d4-aa5f-9a0502c46c41/znYiAFfh.jpg?width=1200&height=750",
        position: "Midfielder",
        bio: "Barcelona and Spain legend, the 'puppet master,' known for his masterful passing, vision, and tactical intelligence, dictating the tempo of the game.",
        achievements: ["FIFA World Cup Champion (2010)", "4x UEFA Champions League Winner", "8x La Liga Champion"],
        traits: { power: 1, flair: 2, leadership: 2, teamwork: 3 }
      },
      {
        name: "Thierry Henry",
        image: "https://assets.goal.com/images/v3/bltd6c4bc35e2449015/a5c71e7f5a974c31cf493e5a1b13a5d796bad56f.jpg?auto=webp&format=pjpg&width=3840&quality=60",
        position: "Forward",
        bio: "Arsenal legend and Premier League icon, known for his blistering pace, silky finishing, and tendency to score from cutting in off the left wing.",
        achievements: ["FIFA World Cup Champion (1998)", "2x Premier League Winner", "UEFA Champions League Winner"],
        traits: { power: 2, flair: 2, leadership: 1, teamwork: 2 }
      },
      {
        name: "Roberto Carlos",
        image: "https://cloudfront-us-east-2.images.arcpublishing.com/reuters/M4G6JQ2SMFM7VK2V6Z5RRR3RYI.jpg",
        position: "Defender",
        bio: "Brazilian left-back famous for his incredible speed, stamina, and thunderbolt free-kicks, particularly his legendary 'impossible' goal against France.",
        achievements: ["FIFA World Cup Champion (2002)", "3x UEFA Champions League Winner", "4x La Liga Champion"],
        traits: { power: 3, flair: 2, leadership: 2, teamwork: 2 }
      },
      {
        name: "Luka Modrić",
        image: "https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/0c25/live/6f1543a0-3719-11f0-96c3-cf669419a2b0.jpg",
        position: "Midfielder",
        bio: "The Croatian playmaker, a 2018 Ballon d’Or winner, known for his immaculate passing, vision, and tireless energy in the center of the pitch.",
        achievements: ["Ballon d’Or Winner (2018)", "5x UEFA Champions League Winner", "Captain of Croatia's Golden Generation"],
        traits: { power: 1, flair: 2, leadership: 3, teamwork: 3 }
      },
      {
        name: "Mohamed Salah",
        image: "https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/11494969/GettyImages_944396220.jpg?quality=90&strip=all&crop=0%2C4.2124542124542%2C100%2C91.575091575092&w=2400",
        position: "Forward",
        bio: "The 'Egyptian King' of Liverpool, known for his blistering pace, prolific goal-scoring, and exceptional dribbling from the right wing.",
        achievements: ["3x Premier League Golden Boot", "UEFA Champions League Winner", "Premier League Champion"],
        traits: { power: 2, flair: 2, leadership: 2, teamwork: 2 }
      },
      {
        name: "Didier Drogba",
        image: "https://img.chelseafc.com/image/upload/f_auto,w_1440,c_fill,g_faces,q_90/The%205th%20Stand%20app%20editorial/Drogba_120.png",
        position: "Forward",
        bio: "Chelsea’s big-game striker and Ivorian legend, loved for his physical strength, leadership, and clutch goals in major finals.",
        achievements: ["4x Premier League Winner", "UEFA Champions League Winner (2012)", "2x Premier League Golden Boot"],
        traits: { power: 3, flair: 1, leadership: 3, teamwork: 2 }
      }
    ];

    window.footballers = footballers;

    const quizQuestionsBase = [
      {
        question: "What’s your playing style on the field?",
        options: [
          { text: "Powerhouse: I dominate with strength and speed", traits: { power: 3, flair: 0, leadership: 0, teamwork: 0 } },
          { text: "Flair: I dazzle with skills and creativity", traits: { power: 0, flair: 3, leadership: 0, teamwork: 0 } },
          { text: "Balanced: I mix power and finesse", traits: { power: 2, flair: 2, leadership: 0, teamwork: 0 } },
          { text: "Strategic: I control the game with smart plays", traits: { power: 0, flair: 2, leadership: 1, teamwork: 1 } }
        ]
      },
      {
        question: "What role do you take in a team?",
        options: [
          { text: "Leader: I inspire and guide the team", traits: { power: 0, flair: 0, leadership: 3, teamwork: 1 } },
          { text: "Team Player: I work seamlessly with others", traits: { power: 0, flair: 0, leadership: 1, teamwork: 3 } },
          { text: "Lone Star: I shine on my own", traits: { power: 1, flair: 1, leadership: 2, teamwork: 0 } },
          { text: "Versatile: I adapt to any role", traits: { power: 1, flair: 1, leadership: 1, teamwork: 1 } }
        ]
      },
      {
        question: "What’s your approach to challenges?",
        options: [
          { text: "Smash through with raw power", traits: { power: 3, flair: 0, leadership: 1, teamwork: 0 } },
          { text: "Outsmart with creativity and finesse", traits: { power: 0, flair: 3, leadership: 0, teamwork: 1 } },
          { text: "Lead and rally others to overcome", traits: { power: 0, flair: 0, leadership: 3, teamwork: 2 } },
          { text: "Stay calm and find a balanced solution", traits: { power: 1, flair: 1, leadership: 1, teamwork: 1 } }
        ]
      },
      {
        question: "Last minute, team needs a goal. You...",
        options: [
           { text: "Demand the ball and shoot from distance", traits: { power: 2, flair: 0, leadership: 2, teamwork: 0 } },
           { text: "Try a solo run through the defense", traits: { power: 0, flair: 3, leadership: 0, teamwork: 0 } },
           { text: "Organize the attack for the best pass", traits: { power: 0, flair: 0, leadership: 2, teamwork: 2 } },
           { text: "Wait in the box for the perfect cross", traits: { power: 2, flair: 0, leadership: 0, teamwork: 1 } }
        ]
      },
      {
        question: "What is your training focus?",
        options: [
           { text: "Gym and physical conditioning", traits: { power: 3, flair: 0, leadership: 0, teamwork: 1 } },
           { text: "Skill moves and dribbling mastery", traits: { power: 0, flair: 3, leadership: 0, teamwork: 0 } },
           { text: "Tactical analysis and positioning", traits: { power: 0, flair: 0, leadership: 2, teamwork: 2 } },
           { text: "Passing drills and team chemistry", traits: { power: 0, flair: 0, leadership: 1, teamwork: 3 } }
        ]
      },
      {
         question: "How do you celebrate a goal?",
         options: [
            { text: "A signature acrobatic move", traits: { power: 1, flair: 3, leadership: 0, teamwork: 0 } },
            { text: "Running to the fans and screaming", traits: { power: 2, flair: 1, leadership: 1, teamwork: 0 } },
            { text: "Pointing to the assist provider", traits: { power: 0, flair: 0, leadership: 1, teamwork: 3 } },
            { text: "Calm, cool, handled business", traits: { power: 0, flair: 1, leadership: 2, teamwork: 1 } }
         ]
      }
    ];

    let isProgramStopped = false;
    let currentFootballer = null;
    let currentQuestionIndex = 0;
    let userTraits = { power: 0, flair: 0, leadership: 0, teamwork: 0 };
    let progressInterval = null;
    let timeouts = [];
    
    let questionTimer;
    const QUESTION_TIME = 10;
    let timeLeft;
    let currentGameMode = '';
    let currentUserName = "Player";

    let keepieScore = 0;
    let keepieBest = 0;
    let keepieBallY = 50;
    let keepieBallVelocity = 0;
    let keepieGravity = 0.5; 
    let keepieGameActive = false;
    let keepieAnimation;
    let minigameInterval = null;
    let gameActive = false;

    function showMenu() {
        resetProgram(true); 

        document.getElementById("quizApp").style.display = "none";
        document.getElementById("keepieContainer").style.display = "none";
        document.getElementById("planetQuizzesContainer").style.display = "none";
        document.getElementById("gameControls").style.display = "none";

        document.getElementById("mainMenu").style.display = "flex";

        document.querySelectorAll("button").forEach(button => button.disabled = false);
    }

    function startGameMode(mode) {
        currentGameMode = mode;
        document.getElementById("mainMenu").style.display = "none";
        document.getElementById("gameControls").style.display = "flex";

        if (mode === 'quiz') {
          document.getElementById("quizApp").style.display = "block";
          startQuiz();
        } else if (mode === 'keepie') {
          document.getElementById("keepieContainer").style.display = "block";
          startKeepieGame();        } else if (mode === 'planetquizzes') {
            document.getElementById("planetQuizzesContainer").style.display = "block";
            if(window.startPlanetQuizzes) window.startPlanetQuizzes();        }
    }

    function resetCurrentGame() {
        if(currentGameMode === 'quiz') {
            resetProgram(true); // Silent reset
            startQuiz();
        } else if(currentGameMode === 'keepie') {
            startKeepieGame();
        } else if(currentGameMode === 'planetquizzes') {
            if(window.startPlanetQuizzes) window.startPlanetQuizzes();
        }
    }

    function handleAppAction(target){
      const action = target && target.getAttribute ? target.getAttribute('data-action') : null;
      if(!action) return false;

      if(action === 'start-game'){
        startGameMode(target.getAttribute('data-mode'));
        return true;
      }

      if(action === 'show-menu'){
        showMenu();
        return true;
      }

      if(action === 'reset-game'){
        resetCurrentGame();
        return true;
      }

      if(action === 'start-top10' && window.startTop10){
        window.startTop10();
        return true;
      }

      if(action === 'start-planet-quizzes' && window.startPlanetQuizzes){
        window.startPlanetQuizzes();
        return true;
      }

      return false;
    }

    let quizQuestions = [];

    function shuffleArray(items) {
      const copy = items.slice();
      for (let index = copy.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
      }
      return copy;
    }

    function startQuiz() {
      
      isProgramStopped = false;
      currentFootballer = null;
      currentQuestionIndex = 0;
      userTraits = { power: 0, flair: 0, leadership: 0, teamwork: 0 };
      quizQuestions = shuffleArray(quizQuestionsBase.map(question => ({
        ...question,
        options: question.options.map(option => ({ ...option }))
      })));
      document.getElementById("quizContainer").classList.add("show");
      document.getElementById("quizContainer").style.display = "block";
      showQuestion();
    }

    function showQuestion() {
      const questionContainer = document.getElementById("questionText");
      const optionsContainer = document.getElementById("optionsContainer");
      const currentQuestion = quizQuestions[currentQuestionIndex];

      startTimer();
      
      questionContainer.innerHTML = `<h3>${currentQuestion.question}</h3>`;
      optionsContainer.innerHTML = "";

      currentQuestion.options.forEach((option, index) => {
        const button = document.createElement("div");
        button.classList.add("quiz-option");
        button.textContent = option.text;
        button.onclick = () => selectOption(option.traits);
        optionsContainer.appendChild(button);
      });
    }

    function startTimer() {
        if (questionTimer) clearInterval(questionTimer);
        timeLeft = QUESTION_TIME;
        updateTimerUI();
        
        questionTimer = setInterval(() => {
            timeLeft--;
            updateTimerUI();
            if (timeLeft <= 0) {
                clearInterval(questionTimer);
                const currentFromTimer = quizQuestions[currentQuestionIndex];
                const randomOptionIndex = Math.floor(Math.random() * currentFromTimer.options.length); 
                const randomTrait = currentFromTimer.options[randomOptionIndex].traits;
                selectOption(randomTrait);
            }
        }, 1000);
    }

    function updateTimerUI() {
        const bar = document.getElementById("timerBar");
        if(bar) {
            bar.style.width = `${(timeLeft / QUESTION_TIME) * 100}%`;
            if(timeLeft <= 3) bar.style.backgroundColor = "#ff6b6b"; 
            else bar.style.backgroundColor = "#28a745";
        }
    }

    function selectOption(traits) {
      if (questionTimer) clearInterval(questionTimer); 
      
      for (let trait in traits) {
        userTraits[trait] += traits[trait];
      }

      currentQuestionIndex++;
      if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
      } else {
        showResult(); 
      }
    }

    function showFloatingText(container, x, y, text, color) {
        const floatEl = document.createElement("div");
        floatEl.classList.add("floating-text");
        floatEl.textContent = text;
        floatEl.style.color = color || "#fff";
        floatEl.style.left = x;
        floatEl.style.top = y; 
        
        container.appendChild(floatEl);
        setTimeout(() => floatEl.remove(), 1000);
    }

    function startKeepieGame() {
        keepieScore = 0;
        keepieBallY = 50;
        keepieBallVelocity = 0;
        keepieGameActive = false;
        
        document.getElementById("keepieScore").textContent = 0;
        document.getElementById("keepieMessage").textContent = `Click/Tap the ball to start!`;
        
        const ball = document.getElementById("keepieBall");
        if (ball) {
            ball.style.bottom = "50%";
            ball.style.left = "50%";
            ball.style.transform = "translate(-50%, 0) rotate(0deg) scale(1)";
            ball.style.opacity = "1";
            ball.style.display = "block";
        }

        if (keepieAnimation) cancelAnimationFrame(keepieAnimation);
        keepieLoop();
    }

    function keepieTap(event) {
        if (!keepieGameActive && keepieScore === 0) {
            keepieGameActive = true;
            document.getElementById("keepieMessage").textContent = "";
        }

        if (!keepieGameActive && keepieBallY <= 0) {
             resetCurrentGame();
             return;
        }

        if (!keepieGameActive) return; 

        keepieBallVelocity = 12; 

        const keepieBallEl = document.getElementById("keepieBall");

        let points = 1;
        let floatsText = "+1";
        let floatColor = "#39FF14";

        if(keepieBallY >= 15 && keepieBallY <= 25) {
            points = 2;
            floatsText = "PERFECT! +2";
            floatColor = "#00FFFF";
        }

        keepieScore += points;
        document.getElementById("keepieScore").textContent = keepieScore;
        
        if(keepieBallEl) {
            keepieBallEl.style.transform = "translate(-50%, 0) scale(1.3, 0.7)"; 
            setTimeout(() => {
                 keepieBallEl.style.transform = `translate(-50%, 0) scale(1) rotate(${Math.random() * 360}deg)`;
            }, 100);
        }
    }

    function keepieLoop() {
        if (keepieGameActive) {
            keepieBallY += keepieBallVelocity;
            keepieBallVelocity -= keepieGravity;

            const ball = document.getElementById("keepieBall");
            
            if(ball) {
                if (keepieBallY < 0) {
                    keepieBallY = 0;
                    keepieGameActive = false;
                    document.getElementById("keepieMessage").textContent = `Dropped! Game Over. Score: ${keepieScore}`;
                    if (keepieScore > keepieBest) {
                        keepieBest = keepieScore;
                        document.getElementById("keepieBest").textContent = keepieBest;
                    }
                }
                
                if (keepieBallY > 90) {
                     keepieBallVelocity = -5;
                }

                ball.style.bottom = keepieBallY + "%";
            }
        }
        keepieAnimation = requestAnimationFrame(keepieLoop);
    }
    
    function showResult() {
      document.getElementById("quizContainer").classList.remove("show");
      document.getElementById("progressContainer").classList.add("show");

      let progress = 0;
      progressInterval = setInterval(() => {
        if (isProgramStopped) {
          clearInterval(progressInterval);
          progressInterval = null;
          return;
        }
        progress += 10;
        if (progress >= 100) {
          clearInterval(progressInterval);
          progressInterval = null;
          progress = 100;
          document.getElementById("progressText").textContent = `Match Found for ${currentUserName}!`;
          if (!isProgramStopped) {
            const match = findBestMatch();
            if (match) displayFootballer();
            else {
              document.getElementById("progressContainer").classList.remove("show");
              document.getElementById("resultContainer").classList.add("show");
              document.getElementById("playerName").textContent = "No Match Found";
              document.getElementById("playerName").classList.remove("hidden-initial");
              document.getElementById("playerName").classList.add("show");
              document.getElementById("playerBio").textContent = `Sorry ${currentUserName}, we couldn't find a footballer that matches your traits. Try again!`;
              document.getElementById("playerBio").classList.remove("hidden-initial");
              document.getElementById("playerBio").classList.add("show");
              isProgramStopped = true;
              document.querySelectorAll('button:not([onclick="resetProgram()"]):not(.theme-toggle)').forEach(button => button.disabled = true);
            }
          }
        }
        document.getElementById("progressBar").style.width = `${progress}%`;
        document.getElementById("progressText").textContent = `Analyzing ${currentUserName}'s stats... ${Math.floor(progress)}%`;
      }, 150);

      timeouts.push(setTimeout(() => {
        if (progress < 100 && !isProgramStopped) {
          clearInterval(progressInterval);
          progressInterval = null;
          document.getElementById("progressBar").style.width = "100%";
          document.getElementById("progressText").textContent = `Match Found for ${currentUserName}!`;
          const match = findBestMatch();
          if (match) displayFootballer();
          else {
            document.getElementById("progressContainer").classList.remove("show");
            document.getElementById("resultContainer").classList.add("show");
            document.getElementById("playerName").textContent = "No Match Found";
            document.getElementById("playerName").classList.remove("hidden-initial");
            document.getElementById("playerName").classList.add("show");
            document.getElementById("playerBio").textContent = `Sorry ${currentUserName}, we couldn't find a footballer that matches your traits. Try again!`;
            document.getElementById("playerBio").classList.remove("hidden-initial");
            document.getElementById("playerBio").classList.add("show");
            isProgramStopped = true;
            document.querySelectorAll('button:not([onclick="resetProgram()"]):not(.theme-toggle)').forEach(button => button.disabled = true);
          }
        }
      }, 3000));
    }

    function displayFootballer() {
      if (isProgramStopped) return;

      currentFootballer = findBestMatch();
      if (!currentFootballer) {
        console.error("No footballer matched in displayFootballer.");
        document.getElementById("progressContainer").classList.remove("show");
        document.getElementById("resultContainer").classList.add("show");
        document.getElementById("playerName").textContent = "No Match Found";
        document.getElementById("playerName").classList.remove("hidden-initial");
        document.getElementById("playerName").classList.add("show");
        document.getElementById("playerBio").textContent = "Sorry, we couldn't find a footballer that matches your traits. Try again!";
        document.getElementById("playerBio").classList.remove("hidden-initial");
        document.getElementById("playerBio").classList.add("show");
        isProgramStopped = true;
        document.querySelectorAll('button:not([onclick="resetProgram()"]):not(.theme-toggle)').forEach(button => button.disabled = true);
        return;
      }

      const imageElement = document.getElementById("randomImage");
      const playerNameElement = document.getElementById("playerName");
      const playerPositionElement = document.getElementById("playerPosition");
      const playerBioElement = document.getElementById("playerBio");
      const playerAchievementsContainer = document.getElementById("playerAchievements");
      const achievementsList = document.getElementById("achievementsList");
      const resultContainer = document.getElementById("resultContainer");

      imageElement.src = currentFootballer.image;
      
      let hasRevealed = false;

      const revealProfile = () => {
        if (isProgramStopped || hasRevealed) return;
        hasRevealed = true;

        document.getElementById("progressContainer").classList.remove("show");
        resultContainer.classList.add("show");

        imageElement.classList.add("show");
        
        playerNameElement.textContent = currentFootballer.name;
        playerNameElement.classList.remove("hidden-initial");
        playerNameElement.classList.add("show");

        const matchText = currentFootballer.matchPercentage ? ` • ${currentFootballer.matchPercentage}% Match` : "";
        playerPositionElement.textContent = `Position: ${currentFootballer.position}${matchText}`;
        playerPositionElement.classList.remove("hidden-initial");
        playerPositionElement.classList.add("show");

        playerBioElement.textContent = currentFootballer.bio;
        playerBioElement.classList.remove("hidden-initial");
        playerBioElement.classList.add("show");

        if (currentFootballer.achievements && currentFootballer.achievements.length > 0) {
          currentFootballer.achievements.forEach(achievement => {
            const listItem = document.createElement("li");
            listItem.textContent = achievement;
            achievementsList.appendChild(listItem);
          });
          playerAchievementsContainer.classList.remove("hidden-initial");
          playerAchievementsContainer.classList.add("show");
        }

        isProgramStopped = true;
        
         const quizButtons = document.querySelectorAll('#quizContainer button');
         quizButtons.forEach(button => button.disabled = true);

         document.querySelectorAll('#gameControls button').forEach(button => button.disabled = false);
      };

      imageElement.onload = revealProfile;
      imageElement.onerror = () => {
        console.error("Image failed to load:", currentFootballer.image);
        revealProfile();
      };

      timeouts.push(setTimeout(revealProfile, 2000));
    }

    function findBestMatch() {
      if (footballers.length === 0) {
        console.error("Footballers array is empty.");
        return null;
      }

      const numQuestions = quizQuestions.length || 1;

      const uPower = userTraits.power / numQuestions;
      const uFlair = userTraits.flair / numQuestions;
      const uLead = userTraits.leadership / numQuestions;
      const uTeam = userTraits.teamwork / numQuestions;

      const candidates = footballers.map(footballer => {
        const distance =
          Math.abs(footballer.traits.power - uPower) +
          Math.abs(footballer.traits.flair - uFlair) +
          Math.abs(footballer.traits.leadership - uLead) +
          Math.abs(footballer.traits.teamwork - uTeam);
        
        return { ...footballer, distance };
      });

      candidates.sort((a, b) => a.distance - b.distance);

     
      const topCandidates = candidates.slice(0, 3);
      
    
      const bestDist = topCandidates[0].distance;
      const validCandidates = topCandidates.filter(c => c.distance <= bestDist + 1.25);

     
      const inputHash = 
        Math.floor(uPower * 100) * 1 + 
        Math.floor(uFlair * 100) * 3 + 
        Math.floor(uLead * 100) * 7 + 
        Math.floor(uTeam * 100) * 13;
        
      const selectedIndex = inputHash % validCandidates.length;
      const bestMatch = validCandidates[selectedIndex];

      if (bestMatch) {
          let percent = Math.max(50, 100 - (bestMatch.distance * 9)); 
          bestMatch.matchPercentage = Math.round(percent);
      }

      return bestMatch;
    }

    function resetProgram(silent = false) {
      isProgramStopped = true;
      currentFootballer = null;
      currentQuestionIndex = 0;
      userTraits = { power: 0, flair: 0, leadership: 0, teamwork: 0 };

      if (questionTimer) clearInterval(questionTimer);
      if (minigameInterval) cancelAnimationFrame(minigameInterval);
      minigameInterval = null;
      if (keepieAnimation) cancelAnimationFrame(keepieAnimation);
      keepieAnimation = null;
      gameActive = false;
      keepieGameActive = false;
      const minigameContainer = document.getElementById("minigameContainer");
      if (minigameContainer) minigameContainer.classList.remove("show");

      const keepieContainer = document.getElementById("keepieContainer");
      if (keepieContainer) keepieContainer.style.display = "none";
      
      const ball = document.getElementById("ball");
      if(ball) {
          ball.classList.remove("ball-moving");
          ball.style.top = "";
          ball.style.bottom = "30px";
          ball.style.transform = "translateX(-50%)";
      }

      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      timeouts.forEach(clearTimeout);
      timeouts = [];

      const imageElement = document.getElementById("randomImage");
      imageElement.src = "";
      imageElement.removeAttribute("src");
      imageElement.classList.remove("show");
      imageElement.onload = null;
      imageElement.onerror = null;

      const optionsContainer = document.getElementById("optionsContainer");
      optionsContainer.innerHTML = "";
      optionsContainer.replaceChildren();

      document.querySelectorAll("button").forEach(button => button.disabled = false);
      document.getElementById("playerName").textContent = "";
      document.getElementById("playerName").classList.add("hidden-initial");
      document.getElementById("playerName").classList.remove("show");
      document.getElementById("playerPosition").textContent = "";
      document.getElementById("playerPosition").classList.add("hidden-initial");
      document.getElementById("playerPosition").classList.remove("show");
      document.getElementById("playerBio").textContent = "";
      document.getElementById("playerBio").classList.add("hidden-initial");
      document.getElementById("playerBio").classList.remove("show");
      document.getElementById("playerAchievements").classList.add("hidden-initial");
      document.getElementById("playerAchievements").classList.remove("show");
      document.getElementById("achievementsList").innerHTML = "";
      document.getElementById("progressContainer").classList.remove("show");
      document.getElementById("quizContainer").classList.remove("show");
      document.getElementById("resultContainer").classList.remove("show");
      document.getElementById("progressBar").style.width = "0%";
      document.getElementById("progressText").textContent = "Analyzing stats...";
      document.getElementById("questionText").innerHTML = "";

      if(!silent) alert("Program has been reset. Ready to play again!");
    }

    document.documentElement.setAttribute("data-theme", "dark");
    
        document.addEventListener("DOMContentLoaded", () => {
          showMenu();

         document.addEventListener('click', (event) => {
           const actionTarget = event.target.closest('[data-action]');
           if(handleAppAction(actionTarget)) return;

           const keepieStartTarget = event.target.closest('#keepieArea, #keepieBall');
           if(keepieStartTarget && currentGameMode === 'keepie') {
             keepieTap(event);
           }
         });

         document.addEventListener('touchstart', (event) => {
           const actionTarget = event.target.closest('[data-action]');
           if(handleAppAction(actionTarget)) return;

           const keepieStartTarget = event.target.closest('#keepieArea, #keepieBall');
           if(keepieStartTarget && currentGameMode === 'keepie') {
             event.preventDefault();
             keepieTap(event);
           }
         }, { passive: false });
    });

        window.showMenu = showMenu;
        window.startGameMode = startGameMode;
        window.resetCurrentGame = resetCurrentGame;
        window.startQuiz = startQuiz;
        window.startKeepieGame = startKeepieGame;


