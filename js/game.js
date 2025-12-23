// ============================================
// ОСНОВНЫЕ НАСТРОЙКИ ИГРЫ
// ============================================
const gameConfig = {
    rows: 8,
    cols: 8,
    fruits: ['🍎', '🍌', '🍇', '🍊','🥩'],
    minMatch: 3,
    scorePerFruit: 100,
    maxMoves: 10
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
        showVideoOverlay();
    }
}

// Показывает полноэкранный оверлей с видео при окончании игры
function showVideoOverlay() {
    // Если оверлей уже открыт — ничего не делаем
    if (document.getElementById('gameOverVideoOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'gameOverVideoOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(0,0,0,0.85)';
    overlay.style.zIndex = '2000';

    // Контейнер для видео и кнопок
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.maxWidth = '90%';
    container.style.maxHeight = '90%';
    container.style.width = '900px';
    container.style.boxSizing = 'border-box';

    // Элемент video — по умолчанию использует файл videos/victory.mp4
    const video = document.createElement('video');
    video.id = 'gameOverVideo';
    video.src = 'videos/vin.mp4'; // замените на ваш путь к видео
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.borderRadius = '12px';
    video.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
    video.autoplay = true;
    video.muted = true; // многие браузеры разрешают autoplay только для muted
    video.playsInline = true;
    video.loop = true;
    video.controls = true;

    container.appendChild(video);

    // Кнопка закрытия
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.innerHTML = '✖';
    closeBtn.title = 'Закрыть';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '-14px';
    closeBtn.style.right = '-14px';
    closeBtn.style.width = '36px';
    closeBtn.style.height = '36px';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.border = 'none';
    closeBtn.style.background = '#fff';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '16px';
    closeBtn.addEventListener('click', hideVideoOverlay);
    container.appendChild(closeBtn);

    // Кнопка "Новая игра" под видео
    const replayBtn = document.createElement('button');
    replayBtn.type = 'button';
    replayBtn.textContent = '🔄 Новая игра';
    replayBtn.style.position = 'absolute';
    replayBtn.style.bottom = '-48px';
    replayBtn.style.left = '50%';
    replayBtn.style.transform = 'translateX(-50%)';
    replayBtn.style.background = 'linear-gradient(to bottom,#FFD700,#FF8C00)';
    replayBtn.style.border = 'none';
    replayBtn.style.borderRadius = '20px';
    replayBtn.style.padding = '8px 12px';
    replayBtn.style.fontWeight = 'bold';
    replayBtn.style.cursor = 'pointer';
    replayBtn.addEventListener('click', () => {
        hideVideoOverlay();
        startNewGame();
    });
    container.appendChild(replayBtn);

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Попытка запустить видео (в некоторых браузерах autoplay может быть запрещён)
    video.play().catch(() => {
        // Если воспроизведение запрещено — оставляем контролы, пользователь может нажать Play
    });

    showMessage('🎉 Игра окончена! Смотрите победное видео');
}

// Скрывает оверлей с видео
function hideVideoOverlay() {
    const overlay = document.getElementById('gameOverVideoOverlay');
    if (!overlay) return;

    const video = overlay.querySelector('video');
    if (video) {
        try { video.pause(); video.currentTime = 0; } catch (e) {}
    }

    overlay.remove();
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