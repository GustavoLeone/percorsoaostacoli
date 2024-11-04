let gridSize = 5;
let score = 0;
let level = 1;
let playerPosition = { x: 0, y: 0 };
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");

const effects = {
    bonus: 5,
    penalty: -5,
    end: 5, // Modificato a 5 punti
};

function initGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = x;
            cell.dataset.y = y;

            if (x === 0 && y === 0) {
                cell.classList.add("cell-start", "cell-visited");
                // Rimosso il testo "Start"
            } else if (x === gridSize - 1 && y === gridSize - 1) {
                cell.classList.add("cell-end");
                // Rimosso il testo "End"
                cell.onclick = () => {
                    if (isAdjacent(x, y)) {
                        score += effects.end;
                        updateScore();
                        nextLevel();
                    }
                };
            } else {
                const effect = getRandomEffect();
                cell.classList.add(effect.class);
                cell.dataset.effect = effect.score;
                cell.textContent = effect.label;
                cell.style.color = "transparent"; // Simboli invisibili finché non attivati
                cell.onclick = () => handleClick(cell, x, y);
            }
            grid.appendChild(cell);
        }
    }
    playerPosition = { x: 0, y: 0 };
    updateAdjacentCells();
}

function getRandomEffect() {
    const random = Math.random();
    if (random < 0.4) return { class: "cell-neutral", score: 0, label: "" };
    if (random < 0.6) return { class: "cell-bonus", score: effects.bonus, label: "+" };
    if (random < 0.8) return { class: "cell-penalty", score: effects.penalty, label: "-" };
    return { class: "cell-neutral", score: 0, label: "" };
}

function handleClick(cell, x, y) {
    if (!isAdjacent(x, y)) return;

    const effect = parseInt(cell.dataset.effect, 10);
    score += effect;
    updateScore();
    cell.classList.add("active", "cell-visited"); // Attiva il simbolo e cambia il colore per tracciare
    cell.classList.remove("cell-locked");

    if (effect !== 0) {
        cell.style.color = ''; // Rende visibile il simbolo nella cella
    }

    playerPosition = { x, y };
    updateAdjacentCells();
}

function updateScore() {
    scoreElement.textContent = score;
}

function isAdjacent(x, y) {
    const dx = Math.abs(playerPosition.x - x);
    const dy = Math.abs(playerPosition.y - y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

function updateAdjacentCells() {
    document.querySelectorAll(".cell").forEach(cell => {
        const x = parseInt(cell.dataset.x, 10);
        const y = parseInt(cell.dataset.y, 10);
        if (!isAdjacent(x, y) || (x === playerPosition.x && y === playerPosition.y)) {
            cell.classList.add("cell-locked");
            cell.style.cursor = 'not-allowed';
        } else {
            cell.classList.remove("cell-locked");
            cell.style.cursor = 'pointer';
        }
    });
}

function nextLevel() {
    level++;
    levelElement.textContent = `Livello: ${level}`;
    if (gridSize < 8) {
        gridSize++;
    }
    initGrid();
}

// Inizializza il primo livello
initGrid();
