// ============================================
// ФУНКЦИИ ДЛЯ ИГРОВОГО ПОЛЯ
// ============================================

// Создание пустого поля
function createEmptyBoard() {
    game.board = [];
    for (let row = 0; row < gameConfig.rows; row++) {
        game.board[row] = [];
        for (let col = 0; col < gameConfig.cols; col++) {
            game.board[row][col] = {
                fruit: null,
                row: row,
                col: col
            };
        }
    }
}

// Заполнение фруктами
function fillWithFruits() {
    for (let row = 0; row < gameConfig.rows; row++) {
        for (let col = 0; col < gameConfig.cols; col++) {
            game.board[row][col].fruit = getRandomFruit();
        }
    }
}

// Отрисовка игрового поля
function drawGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${gameConfig.cols}, 1fr)`;
    
    for (let row = 0; row < gameConfig.rows; row++) {
        for (let col = 0; col < gameConfig.cols; col++) {
            const tile = game.board[row][col];
            const cell = document.createElement('div');
            
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.textContent = tile.fruit;
            cell.dataset.fruit = tile.fruit;
            
            cell.addEventListener('click', () => handleFruitClick(row, col));
            gameBoard.appendChild(cell);
        }
    }
    
    // Выделяем выбранный фрукт
    if (game.selectedFruit) {
        const {row, col} = game.selectedFruit;
        const selectedCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (selectedCell) {
            selectedCell.classList.add('selected');
        }
    }
}

// Поиск совпадений
function findMatches() {
    const matches = [];
    
    // Проверяем горизонтальные линии
    for (let row = 0; row < gameConfig.rows; row++) {
        for (let col = 0; col < gameConfig.cols - 2; col++) {
            const fruit = game.board[row][col].fruit;
            if (fruit && 
                fruit === game.board[row][col+1].fruit && 
                fruit === game.board[row][col+2].fruit) {
                
                let matchEnd = col + 2;
                while (matchEnd + 1 < gameConfig.cols && 
                       game.board[row][matchEnd+1].fruit === fruit) {
                    matchEnd++;
                }
                
                const tiles = [];
                for (let c = col; c <= matchEnd; c++) {
                    tiles.push({row, col: c});
                }
                
                matches.push({
                    fruit: fruit,
                    tiles: tiles,
                    direction: 'horizontal'
                });
                
                col = matchEnd;
            }
        }
    }
    
    // Проверяем вертикальные линии
    for (let col = 0; col < gameConfig.cols; col++) {
        for (let row = 0; row < gameConfig.rows - 2; row++) {
            const fruit = game.board[row][col].fruit;
            if (fruit && 
                fruit === game.board[row+1][col].fruit && 
                fruit === game.board[row+2][col].fruit) {
                
                let matchEnd = row + 2;
                while (matchEnd + 1 < gameConfig.rows && 
                       game.board[matchEnd+1][col].fruit === fruit) {
                    matchEnd++;
                }
                
                const tiles = [];
                for (let r = row; r <= matchEnd; r++) {
                    tiles.push({row: r, col});
                }
                
                matches.push({
                    fruit: fruit,
                    tiles: tiles,
                    direction: 'vertical'
                });
                
                row = matchEnd;
            }
        }
    }
    
    return matches;
}

// Падение фруктов
function dropFruitsDown() {
    for (let col = 0; col < gameConfig.cols; col++) {
        let emptyRow = gameConfig.rows - 1;
        
        for (let row = gameConfig.rows - 1; row >= 0; row--) {
            if (game.board[row][col].fruit !== null) {
                if (row !== emptyRow) {
                    game.board[emptyRow][col].fruit = game.board[row][col].fruit;
                    game.board[row][col].fruit = null;
                }
                emptyRow--;
            }
        }
    }
}

// Заполнение пустых мест
function fillEmptySpaces() {
    for (let row = 0; row < gameConfig.rows; row++) {
        for (let col = 0; col < gameConfig.cols; col++) {
            if (game.board[row][col].fruit === null) {
                game.board[row][col].fruit = getRandomFruit();
            }
        }
    }
    
    drawGameBoard();
}