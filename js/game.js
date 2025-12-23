// ============================================
// ОСНОВНЫЕ НАСТРОЙКИ ИГРЫ
// ============================================
const gameConfig = {
    rows: 8,
    cols: 8,
    fruits: ['🍎', '🍌', '🍇', '🍊','🥩'],
    minMatch: 3,
    scorePerFruit: 100,
    maxMoves: 30
};

// ============================================
// СОСТОЯНИЕ ИГРЫ
// ============================================
let game = {
    board: [],
    selectedFruit: null,
    score: 0,
    moves: 0,
    isGameOver: false,
    combo: 0
};

// ============================================
// ГЛАВНЫЕ ФУНКЦИИ ИГРЫ
// ============================================

// Запуск новой игры
function startNewGame() {
    console.log("🚀 Запускаем новую игру!");
    
    game = {
        board: [],
        selectedFruit: null,
        score: 0,
        moves: 0,
        isGameOver: false,
        combo: 0
    };
    
    createEmptyBoard();
    fillWithFruits();
    removeStartingMatches();
    drawGameBoard();
    updateScoreDisplay();
    showMessage("🎮 Игра началась! Выберите первый фрукт");
}

// Получение случайного фрукта
function getRandomFruit() {
    const randomIndex = Math.floor(Math.random() * gameConfig.fruits.length);
    return gameConfig.fruits[randomIndex];
}

// Удаление совпадений в начале
function removeStartingMatches() {
    let hasMatches = true;
    
    while (hasMatches) {
        const matches = findMatches();
        if (matches.length === 0) {
            hasMatches = false;
        } else {
            for (const match of matches) {
                for (const tile of match.tiles) {
                    game.board[tile.row][tile.col].fruit = getRandomFruit();
                }
            }
        }
    }
}

// Обмен фруктов
function swapFruits(row1, col1, row2, col2) {
    const temp = game.board[row1][col1].fruit;
    game.board[row1][col1].fruit = game.board[row2][col2].fruit;
    game.board[row2][col2].fruit = temp;
}

// Проверка окончания игры
function checkIfGameOver() {
    if (game.moves >= gameConfig.maxMoves) {
        game.isGameOver = true;
        showMessage(`🎮 Игра окончена! Ваш счет: ${game.score}`);
    }
}

// ============================================
// ЭКСПОРТ ФУНКЦИЙ ДЛЯ АНИМАЦИЙ
// ============================================

// Делаем функции доступными для других модулей
window.swapFruits = swapFruits;
window.findMatches = findMatches;
window.dropFruitsDown = dropFruitsDown;
window.fillEmptySpaces = fillEmptySpaces;
window.gameConfig = gameConfig;