document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    const state = {
        mood: null, // 'happy' or 'sad'
        stage: 'mood', // 'mood', 'color', 'number1', 'number2', 'reveal'
        animationInProgress: false
    };

    // --- Configuration ---
    const config = {
        happy: {
            colors: ['#FF5252', '#448AFF', '#69F0AE', '#FFD740'], // Red, Blue, Green, Yellow
            colorNames: ['Red', 'Blue', 'Green', 'Yellow'],
            numbers: [1, 2, 3, 4, 5, 6, 7, 8],
            fortunes: [
                "Great joy is coming your way!",
                "A pleasant surprise awaits you.",
                "Your smile will brighten someone's day.",
                "Good luck will follow you today.",
                "You will achieve your goals soon.",
                "Happiness is right around the corner.",
                "An exciting opportunity is ahead.",
                "You are loved more than you know."
            ]
        },
        sad: {
            colors: ['#5C6BC0', '#78909C', '#8D6E63', '#AB47BC'], // Muted Indigo, BlueGrey, Brown, Purple
            colorNames: ['Indigo', 'Storm', 'Cocoa', 'Twilight'],
            numbers: [1, 2, 3, 4, 5, 6, 7, 8],
            fortunes: [
                "This too shall pass.",
                "Rainstorms nurture bright flowers.",
                "Tomorrow is a fresh start.",
                "You are stronger than you feel.",
                "Take time to heal yourself.",
                "Peace comes from within.",
                "Better days are coming.",
                "You are not alone."
            ]
        }
    };

    // --- DOM Elements ---
    const screens = {
        mood: document.getElementById('mood-screen'),
        game: document.getElementById('game-screen'),
        result: document.getElementById('result-screen')
    };
    const moodButtons = document.querySelectorAll('.mood-btn');
    const backBtn = document.getElementById('back-btn');
    const restartBtn = document.getElementById('restart-btn');
    const fortuneTeller = document.getElementById('fortune-teller');
    const instructionText = document.getElementById('instruction-text');
    const fortuneText = document.getElementById('fortune-text');

    // --- Event Listeners ---
    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => setMood(btn.dataset.mood));
    });

    backBtn.addEventListener('click', () => {
        if (state.stage === 'color') {
            switchScreen('mood');
        } else {
            resetGame();
        }
    });

    restartBtn.addEventListener('click', resetGame);

    // --- Functions ---

    function switchScreen(screenName) {
        // Hide all screens
        Object.values(screens).forEach(s => {
            s.classList.remove('active');
            setTimeout(() => s.classList.add('hidden'), 300); // Wait for fade out
        });

        // Show target screen
        const target = screens[screenName];
        target.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => target.classList.add('active'), 50);
    }

    function setMood(mood) {
        state.mood = mood;
        document.body.className = `theme-${mood}`;
        startColorStage();
    }

    function startColorStage() {
        state.stage = 'color';
        instructionText.textContent = "Pick a color";
        switchScreen('game');
        renderColors();
    }

    function renderColors() {
        fortuneTeller.innerHTML = '';
        const theme = config[state.mood];

        theme.colors.forEach((color, index) => {
            const flap = document.createElement('div');
            flap.className = `flap color-flap`;
            flap.style.backgroundColor = color;
            flap.textContent = theme.colorNames[index];
            flap.dataset.value = theme.colorNames[index];

            flap.addEventListener('click', () => handleColorClick(theme.colorNames[index]));

            fortuneTeller.appendChild(flap);
        });
    }

    function handleColorClick(colorName) {
        if (state.animationInProgress) return;

        // Count letters in color name
        const count = colorName.length;
        animateCounting(count, () => {
            startNumberStage(1);
        });
    }

    function startNumberStage(stageNum) {
        state.stage = `number${stageNum}`;
        instructionText.textContent = "Pick a number";
        renderNumbers();
    }

    function renderNumbers() {
        fortuneTeller.innerHTML = '';
        // Show 4 numbers. Visual choice: 
        // Mood happy: bright colors for numbers? White is fine.
        const numbersToShow = state.stage === 'number1' ? [1, 2, 5, 6] : [3, 4, 7, 8];

        numbersToShow.forEach(num => {
            const flap = document.createElement('div');
            flap.className = 'flap number-flap';
            flap.textContent = num;
            flap.style.backgroundColor = '#fdfdfd';
            flap.style.color = '#333';

            flap.addEventListener('click', () => handleNumberClick(num));

            fortuneTeller.appendChild(flap);
        });
    }

    function handleNumberClick(number) {
        if (state.animationInProgress) return;

        animateCounting(number, () => {
            if (state.stage === 'number1') {
                startNumberStage(2);
            } else {
                revealFortune(number);
            }
        });
    }

    function revealFortune(finalNumber) {
        state.stage = 'reveal';
        const theme = config[state.mood];
        const fortuneIndex = (finalNumber - 1) % theme.fortunes.length;
        const fortune = theme.fortunes[fortuneIndex];

        fortuneText.textContent = fortune;
        switchScreen('result');
    }

    function animateCounting(count, callback) {
        state.animationInProgress = true;
        let currentCount = 0;

        instructionText.textContent = "1";

        const interval = setInterval(() => {
            currentCount++;
            document.getElementById('instruction-text').innerText = currentCount;

            // Simple visual toggle/pulse animation
            fortuneTeller.style.transform = `scale(0.95) rotate(${currentCount % 2 === 0 ? 3 : -3}deg)`;

            if (currentCount >= count) {
                clearInterval(interval);
                fortuneTeller.style.transform = 'scale(1) rotate(0deg)';
                state.animationInProgress = false;
                // pause briefly before showing next stage
                setTimeout(callback, 300);
            }
        }, 600); // 0.6s per count
    }

    function resetGame() {
        state.mood = null;
        state.stage = 'mood';
        document.body.className = '';
        switchScreen('mood');
    }
});
