document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const choices = document.querySelectorAll('.choice');
    const playerChoiceDisplay = document.getElementById('player-choice-display');
    const computerChoiceDisplay = document.getElementById('computer-choice-display');
    const resultText = document.getElementById('result-text');
    const playerScoreElement = document.getElementById('player-score');
    const computerScoreElement = document.getElementById('computer-score');
    const roundElement = document.getElementById('round');
    const nextRoundBtn = document.getElementById('next-round-btn');
    const confettiContainer = document.getElementById('confetti-container');
    
    // Audio elements
    const winSound = document.getElementById('win-sound');
    const loseSound = document.getElementById('lose-sound');
    const drawSound = document.getElementById('draw-sound');
    const clickSound = document.getElementById('click-sound');
    
    // Game variables
    let playerScore = 0;
    let computerScore = 0;
    let round = 1;
    let gameActive = true;
    
    // Initialize game
    function initGame() {
        updateScores();
        resetChoices();
        gameActive = true;
        nextRoundBtn.style.display = 'none';
    }
    
    // Update score displays
    function updateScores() {
        playerScoreElement.textContent = playerScore;
        computerScoreElement.textContent = computerScore;
        roundElement.textContent = round;
    }
    
    // Reset choice displays
    function resetChoices() {
        playerChoiceDisplay.innerHTML = '<span>?</span>';
        computerChoiceDisplay.innerHTML = '<span>?</span>';
        playerChoiceDisplay.className = 'choice-display';
        computerChoiceDisplay.className = 'choice-display';
        resultText.textContent = 'Choose your weapon!';
        resultText.className = '';
    }
    
    // Computer makes random choice
    function computerPlay() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
    }
    
    // Determine the winner
    function playRound(playerSelection, computerSelection) {
        if (playerSelection === computerSelection) {
            return 'draw';
        }
        
        if (
            (playerSelection === 'rock' && computerSelection === 'scissors') ||
            (playerSelection === 'paper' && computerSelection === 'rock') ||
            (playerSelection === 'scissors' && computerSelection === 'paper')
        ) {
            return 'player';
        } else {
            return 'computer';
        }
    }
    
    // Display choices with animations
    function displayChoices(playerChoice, computerChoice) {
        // Player choice
        playerChoiceDisplay.innerHTML = `<span>${getEmoji(playerChoice)}</span>`;
        playerChoiceDisplay.classList.add('animate__animated', 'animate__bounceIn');
        
        // Computer choice (with slight delay)
        setTimeout(() => {
            computerChoiceDisplay.innerHTML = `<span>${getEmoji(computerChoice)}</span>`;
            computerChoiceDisplay.classList.add('animate__animated', 'animate__bounceIn');
        }, 300);
    }
    
    // Get emoji for choice
    function getEmoji(choice) {
        switch(choice) {
            case 'rock': return '✊';
            case 'paper': return '✋';
            case 'scissors': return '✌️';
            default: return '?';
        }
    }
    
    // Display result with animations
    function displayResult(result, playerChoice, computerChoice) {
        setTimeout(() => {
            switch(result) {
                case 'player':
                    playerChoiceDisplay.classList.add('winner');
                    computerChoiceDisplay.classList.add('loser');
                    resultText.textContent = `${capitalizeFirstLetter(playerChoice)} beats ${capitalizeFirstLetter(computerChoice)}! You win!`;
                    resultText.classList.add('animate__animated', 'animate__tada');
                    playerScore++;
                    playSound(winSound);
                    createConfetti();
                    break;
                case 'computer':
                    playerChoiceDisplay.classList.add('loser');
                    computerChoiceDisplay.classList.add('winner');
                    resultText.textContent = `${capitalizeFirstLetter(computerChoice)} beats ${capitalizeFirstLetter(playerChoice)}! You lose!`;
                    resultText.classList.add('animate__animated', 'animate__shakeX');
                    computerScore++;
                    playSound(loseSound);
                    break;
                case 'draw':
                    playerChoiceDisplay.classList.add('draw');
                    computerChoiceDisplay.classList.add('draw');
                    resultText.textContent = `Both chose ${capitalizeFirstLetter(playerChoice)}! It's a draw!`;
                    resultText.classList.add('animate__animated', 'animate__pulse');
                    playSound(drawSound);
                    break;
            }
            
            round++;
            updateScores();
            gameActive = false;
            nextRoundBtn.style.display = 'block';
            nextRoundBtn.classList.add('animate__animated', 'animate__pulse');
        }, 600);
    }
    
    // Capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Play sound
    function playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }
    
    // Create confetti effect
    function createConfetti() {
        // Clear previous confetti
        confettiContainer.innerHTML = '';
        
        // Create new confetti
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random properties
            const size = Math.random() * 10 + 5;
            const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            
            // Apply styles
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.left = `${left}%`;
            confetti.style.animationDuration = `${animationDuration}s`;
            confetti.style.animationDelay = `${delay}s`;
            
            confettiContainer.appendChild(confetti);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    }
    
    // Event listeners
    choices.forEach(choice => {
        choice.addEventListener('click', () => {
            if (!gameActive) return;
            
            playSound(clickSound);
            
            const playerChoice = choice.dataset.choice;
            const computerChoice = computerPlay();
            const result = playRound(playerChoice, computerChoice);
            
            // Add click animation
            choice.querySelector('.choice-inner').classList.add('animate__rubberBand');
            setTimeout(() => {
                choice.querySelector('.choice-inner').classList.remove('animate__rubberBand');
            }, 1000);
            
            displayChoices(playerChoice, computerChoice);
            displayResult(result, playerChoice, computerChoice);
        });
    });
    
    nextRoundBtn.addEventListener('click', () => {
        playSound(clickSound);
        initGame();
    });
    
    // Initialize game
    initGame();
});