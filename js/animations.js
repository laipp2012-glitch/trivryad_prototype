// ============================================
// АНИМАЦИИ И ЭФФЕКТЫ
// ============================================

// Анимация обмена
function animateSwap(row1, col1, row2, col2) {
    const cell1 = document.querySelector(`.cell[data-row="${row1}"][data-col="${col1}"]`);
    const cell2 = document.querySelector(`.cell[data-row="${row2}"][data-col="${col2}"]`);
    
    if (cell1 && cell2) {
        cell1.classList.add('swapping');
        cell2.classList.add('swapping');
        
        setTimeout(() => {
            cell1.classList.remove('swapping');
            cell2.classList.remove('swapping');
        }, 200);
    }
}

// Взрыв фрукта
function explodeFruit(row, col, fruit) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cell) return;
    
    const rect = cell.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    cell.classList.add('exploding');
    
    // Создаем частицы
    for (let i = 0; i < 15; i++) {
        createParticle(centerX, centerY, fruit);
    }
    
    createFlashEffect();
}

// Создание частицы
function createParticle(x, y, fruit) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = fruit;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const rotation = Math.random() * 360;
    
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.setProperty('--rot', `${rotation}deg`);
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 700);
}

// Анимация комбо
function showComboAnimation(comboCount) {
    if (comboCount > 1) {
        const comboText = document.createElement('div');
        comboText.className = 'combo-text';
        comboText.textContent = `x${comboCount} КОМБО!`;
        
        document.body.appendChild(comboText);
        
        setTimeout(() => comboText.remove(), 1000);
    }
}