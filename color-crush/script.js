document.addEventListener('DOMContentLoaded', () => {
    const BOARD_SIZE = 8;
    const CANDY_COLORS = [
        'red', 'yellow', 'green', 'blue', 'purple'
    ];
    
    const board = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const movesDisplay = document.getElementById('moves');
    const restartBtn = document.getElementById('restart-btn');
    
    let grid = [];
    let score = 0;
    let movesLeft = 15;
    let selectedCandy = null;
    
    // Initialize game
    function createBoard() {
        board.innerHTML = '';
        grid = [];
        score = 0;
        movesLeft = 15;
        scoreDisplay.textContent = score;
        movesDisplay.textContent = movesLeft;
        
        // Create board grid
        for (let row = 0; row < BOARD_SIZE; row++) {
            grid[row] = [];
            for (let col = 0; col < BOARD_SIZE; col++) {
                // Create candy element
                const candy = document.createElement('div');
                const randomColor = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
                candy.className = `candy candy-${randomColor}`;
                candy.dataset.row = row;
                candy.dataset.col = col;
                
                // Add click event
                candy.addEventListener('click', () => selectCandy(row, col));
                
                // Add to board
                board.appendChild(candy);
                grid[row][col] = {
                    element: candy,
                    color: randomColor
                };
            }
        }
    }
    
    // Select candy
    function selectCandy(row, col) {
        if (movesLeft <= 0) return;
        
        const candy = grid[row][col];
        
        // If no candy selected, select this one
        if (!selectedCandy) {
            selectedCandy = candy;
            candy.element.style.border = '3px solid white';
            return;
        }
        
        // If same candy clicked twice, deselect
        if (selectedCandy === candy) {
            selectedCandy.element.style.border = 'none';
            selectedCandy = null;
            return;
        }
        
        // Check if candies are adjacent
        const selectedRow = parseInt(selectedCandy.element.dataset.row);
        const selectedCol = parseInt(selectedCandy.element.dataset.col);
        
        if (
            (Math.abs(row - selectedRow) === 1 && col === selectedCol) ||
            (Math.abs(col - selectedCol) === 1 && row === selectedRow)
        ) {
            // Swap candies
            swapCandies(selectedRow, selectedCol, row, col);
            selectedCandy.element.style.border = 'none';
            selectedCandy = null;
            
            // Check for matches
            const matches = findMatches();
            if (matches.length > 0) {
                removeMatches(matches);
                moveCandiesDown();
                fillEmptySpaces();
                updateScore(matches.length);
            } else {
                // No matches, swap back
                setTimeout(() => {
                    swapCandies(selectedRow, selectedCol, row, col);
                }, 300);
            }
            
            // Decrease moves
            movesLeft--;
            movesDisplay.textContent = movesLeft;
            
            // Check game over
            if (movesLeft <= 0) {
                setTimeout(() => {
                    alert(`Game Over! Your score: ${score}`);
                }, 500);
            }
        } else {
            // Not adjacent, select new candy
            selectedCandy.element.style.border = 'none';
            selectedCandy = candy;
            candy.element.style.border = '3px solid white';
        }
    }
    
    // Swap two candies
    function swapCandies(row1, col1, row2, col2) {
        // Swap in grid
        const temp = grid[row1][col1];
        grid[row1][col1] = grid[row2][col2];
        grid[row2][col2] = temp;
        
        // Update DOM positions
        grid[row1][col1].element.dataset.row = row1;
        grid[row1][col1].element.dataset.col = col1;
        grid[row2][col2].element.dataset.row = row2;
        grid[row2][col2].element.dataset.col = col2;
    }
    
    // Find matching candies
    function findMatches() {
        const matches = [];
        
        // Check horizontal matches
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE - 2; col++) {
                const color = grid[row][col].color;
                if (
                    grid[row][col + 1].color === color &&
                    grid[row][col + 2].color === color
                ) {
                    // Found a match of 3
                    const match = [
                        { row, col },
                        { row, col: col + 1 },
                        { row, col: col + 2 }
                    ];
                    
                    // Check for longer matches
                    let extendCol = col + 3;
                    while (extendCol < BOARD_SIZE && grid[row][extendCol].color === color) {
                        match.push({ row, col: extendCol });
                        extendCol++;
                    }
                    
                    matches.push(...match);
                }
            }
        }
        
        // Check vertical matches
        for (let col = 0; col < BOARD_SIZE; col++) {
            for (let row = 0; row < BOARD_SIZE - 2; row++) {
                const color = grid[row][col].color;
                if (
                    grid[row + 1][col].color === color &&
                    grid[row + 2][col].color === color
                ) {
                    // Found a match of 3
                    const match = [
                        { row, col },
                        { row: row + 1, col },
                        { row: row + 2, col }
                    ];
                    
                    // Check for longer matches
                    let extendRow = row + 3;
                    while (extendRow < BOARD_SIZE && grid[extendRow][col].color === color) {
                        match.push({ row: extendRow, col });
                        extendRow++;
                    }
                    
                    matches.push(...match);
                }
            }
        }
        
        // Remove duplicates
        return Array.from(new Set(matches.map(m => `${m.row},${m.col}`)))
            .map(str => {
                const [row, col] = str.split(',');
                return { row: parseInt(row), col: parseInt(col) };
            });
    }
    
    // Remove matched candies
    function removeMatches(matches) {
        matches.forEach(match => {
            const { row, col } = match;
            grid[row][col].element.style.visibility = 'hidden';
            grid[row][col].color = null;
        });
    }
    
    // Move candies down to fill empty spaces
    function moveCandiesDown() {
        for (let col = 0; col < BOARD_SIZE; col++) {
            let emptyRow = BOARD_SIZE - 1;
            
            for (let row = BOARD_SIZE - 1; row >= 0; row--) {
                if (grid[row][col].color !== null) {
                    if (row !== emptyRow) {
                        // Move candy down
                        grid[emptyRow][col] = grid[row][col];
                        grid[row][col] = { element: createEmptyCandy(row, col), color: null };
                        
                        // Update DOM
                        grid[emptyRow][col].element.dataset.row = emptyRow;
                        board.appendChild(grid[emptyRow][col].element);
                    }
                    emptyRow--;
                }
            }
        }
    }
    
    // Fill empty spaces at the top with new candies
    function fillEmptySpaces() {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (grid[row][col].color === null) {
                    const randomColor = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
                    const candy = document.createElement('div');
                    candy.className = `candy candy-${randomColor}`;
                    candy.dataset.row = row;
                    candy.dataset.col = col;
                    candy.addEventListener('click', () => selectCandy(row, col));
                    
                    board.appendChild(candy);
                    grid[row][col] = {
                        element: candy,
                        color: randomColor
                    };
                }
            }
        }
    }
    
    // Create empty candy placeholder
    function createEmptyCandy(row, col) {
        const candy = document.createElement('div');
        candy.className = 'candy';
        candy.dataset.row = row;
        candy.dataset.col = col;
        return candy;
    }
    
    // Update score
    function updateScore(matchesCount) {
        score += matchesCount * 10;
        scoreDisplay.textContent = score;
    }
    
    // Restart game
    restartBtn.addEventListener('click', createBoard);
    
    // Start the game
    createBoard();
});