// ============================================
// ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ ИЗ HTML
// ============================================
const scoreValue = document.querySelector('.score-value');
const movesValue = document.querySelector('.moves-value');
const messageEl = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const hintButton = document.getElementById('hintButton');

// ============================================
// ФУНКЦИИ ДЛЯ ИНТЕРФЕЙСА
// ============================================

// Клик по фрукту
function handleFruitClick(row, col) {
    if (game.isGameOver) return;
    
    if (!game.selectedFruit) {
        game.selectedFruit = {row, col};
        drawGameBoard();
        showMessage("✅ Фрукт выбран. Теперь выберите соседний фрукт");
        return;
    }
    
    const selectedRow = game.selectedFruit.row;
    const selectedCol = game.selectedFruit.col;
    
    const isNeighbor = Math.abs(row - selectedRow) + Math.abs(col - selectedCol) === 1;
    
    if (!isNeighbor) {
        game.selectedFruit = {row, col};
        drawGameBoard();
        showMessage("🔄 Выбран другой фрукт");
        return;
    }
    
    animateSwap(selectedRow, selectedCol, row, col);
    swapFruits(selectedRow, selectedCol, row, col);
    
    const matches = findMatches();
    
    if (matches.length === 0) {
        setTimeout(() => {
            swapFruits(selectedRow, selectedCol, row, col);
            game.selectedFruit = null;
            drawGameBoard();
            showMessage("❌ Нет совпадений. Попробуйте еще!");
        }, 300);
    } else {
        game.selectedFruit = null;
        game.moves++;
        game.combo = 1;
        
        setTimeout(() => {
            processMatches(matches);
            showMessage("🎉 Отличный ход!");
            checkIfGameOver();
        }, 500);
    }
    
    updateScoreDisplay();
}

// Обработка совпадений
function processMatches(matches) {
    const tilesToRemove = [];
    
    for (const match of matches) {
        for (const tile of match.tiles) {
            if (!tilesToRemove.some(t => t.row === tile.row && t.col === tile.col)) {
                tilesToRemove.push(tile);
            }
        }
    }
    
    tilesToRemove.forEach((tile, index) => {
        const fruit = game.board[tile.row][tile.col].fruit;
        setTimeout(() => {
            explodeFruit(tile.row, tile.col, fruit);
        }, index * 30);
    });
    
    setTimeout(() => {
        for (const tile of tilesToRemove) {
            game.board[tile.row][tile.col].fruit = null;
        }
        
        game.score += tilesToRemove.length * gameConfig.scorePerFruit;
        
        drawGameBoard();
        updateScoreDisplay();
        
        setTimeout(() => {
            dropFruitsDown();
            fillEmptySpaces();
            
            const newMatches = findMatches();
            if (newMatches.length > 0) {
                game.combo++;
                showComboAnimation(game.combo);
                setTimeout(() => {
                    processMatches(newMatches);
                    showMessage(`🔥 x${game.combo} КОМБО!`);
                }, 500);
            }
        }, 500);
    }, tilesToRemove.length * 30 + 200);
}

// Подсказка
function showHint() {
    if (game.isGameOver) return;
    
    for (let row = 0; row < gameConfig.rows; row++) {
        for (let col = 0; col < gameConfig.cols; col++) {
            if (col < gameConfig.cols - 1) {
                swapFruits(row, col, row, col + 1);
                const matches = findMatches();
                swapFruits(row, col, row, col + 1);
                
                if (matches.length > 0) {
                    highlightHint(row, col, row, col + 1);
                    return;
                }
            }
            
            if (row < gameConfig.rows - 1) {
                swapFruits(row, col, row + 1, col);
                const matches = findMatches();
                swapFruits(row, col, row + 1, col);
                
                if (matches.length > 0) {
                    highlightHint(row, col, row + 1, col);
                    return;
                }
            }
        }
    }
    
    showMessage("🤔 Подсказка не найдена");
}

// Выделение подсказки
function highlightHint(row1, col1, row2, col2) {
    const cell1 = document.querySelector(`.cell[data-row="${row1}"][data-col="${col1}"]`);
    const cell2 = document.querySelector(`.cell[data-row="${row2}"][data-col="${col2}"]`);
    
    if (cell1 && cell2) {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        cell1.classList.add('selected');
        cell2.classList.add('selected');
        
        showMessage("💡 Поменяйте эти фрукты местами");
        
        setTimeout(() => {
            cell1.classList.remove('selected');
            cell2.classList.remove('selected');
            game.selectedFruit = null;
            showMessage("Попробуйте сами!");
        }, 3000);
    }
}

// Обновление счета на экране
function updateScoreDisplay() {
    scoreValue.textContent = game.score;
    movesValue.textContent = `${game.moves} / ${gameConfig.maxMoves}`;
}

// Показ сообщений
function showMessage(text) {
    messageEl.textContent = text;
}

// ============================================
// ЗАПУСК ИГРЫ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================
window.addEventListener('DOMContentLoaded', startNewGame);
restartButton.addEventListener('click', startNewGame);
hintButton.addEventListener('click', showHint);

console.log("✨ Игра готова к запуску!");