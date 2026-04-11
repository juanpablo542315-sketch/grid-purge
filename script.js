const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('game-status');
const instrText = document.getElementById('instruction-text');
const btnNext = document.getElementById('btn-next');
const btnRestart = document.getElementById('btn-restart');
const music = document.getElementById('tron-music');

// --- 1. CONFIGURACIÓN DE MECÁNICA ---
canvas.width = 800;
canvas.height = 500;
const GRID_SIZE = 10;
const WIDTH_UNITS = canvas.width / GRID_SIZE;
const HEIGHT_UNITS = canvas.height / GRID_SIZE;

// --- 2. CONFIGURACIÓN VISUAL ---
const VANISHING_POINT_Y = canvas.height * 0.4;
const HORIZON_COLOR = "#002030";
const GRID_COLOR = "#00f2ff"; 
let gridOffset = 0;

let gameRunning = false;
let step = 0;
let gridData = [];

// --- 3. NUEVAS VARIABLES DE PROGRESO ---
let nivel = 1;
let tiempoSobrevivido = 0;
let puntajeMaximo = localStorage.getItem('tronMaxScore') || 0;
let intervaloTiempo;
let gameSpeed = 80; // Velocidad inicial (Nivel 1)

const messages = [
    "<p class='text-white'>SISTEMA: Conexión establecida... <br><br>Bienvenido, Usuario. Estás dentro de la red de combate.</p>",
    "<p class='text-cyan'>OBJETIVO: <br><br>Crea muros de luz para encerrar a GLU. No toques ninguna estela o serás desintegrado.</p>",
    "<p class='text-warning'>CONTROLES: <br><br>Usa las FLECHAS para girar. El espacio reinicia el combate.</p>",
    "<p class='text-success fw-bold'>¡LISTO! <br><br>Presiona el botón para entrar al Grid y comenzar.</p>"
];

instrText.innerHTML = messages[0];

btnNext.addEventListener('click', () => {
    music.play().catch(() => {});
    step++;
    if (step < messages.length) {
        instrText.innerHTML = messages[step];
    } else {
        btnNext.classList.add('d-none');
        btnRestart.classList.remove('d-none');
        resetGame();
    }
});

class Bike {
    constructor(x, y, color, direction, isPlayer) {
        this.x = x; this.y = y; this.color = color;
        this.direction = direction; 
        this.trail = []; this.isPlayer = isPlayer;
        this.alive = true;
    }
    reset(x, y, direction) {
        this.x = x; this.y = y; this.direction = direction;
        this.trail = []; this.alive = true;
    }
    update() {
        if (!this.alive) return;
        this.trail.push({x: this.x, y: this.y});
        if (this.x >= 0 && this.x < WIDTH_UNITS && this.y >= 0 && this.y < HEIGHT_UNITS) {
            gridData[this.x][this.y] = this.color;
        }
        if (this.direction === 0) this.y--; 
        if (this.direction === 1) this.x++;
        if (this.direction === 2) this.y++; 
        if (this.direction === 3) this.x--;
    }

    checkDeath() {
        if (this.x < 0 || this.x >= WIDTH_UNITS || this.y < 0 || this.y >= HEIGHT_UNITS || gridData[this.x][this.y]) {
            return true;
        }
        return false;
    }
    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        this.trail.forEach((p, i) => {
            const drawX = p.x * GRID_SIZE + 5;
            const drawY = p.y * GRID_SIZE + 5;
            if (i === 0) ctx.moveTo(drawX, drawY);
            else ctx.lineTo(drawX, drawY);
        });
        ctx.lineTo(this.x * GRID_SIZE + 5, this.y * GRID_SIZE + 5);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.fillRect(this.x * GRID_SIZE, this.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
    kill() {
        if (this.alive) {
            this.alive = false;
            endGame(this.isPlayer ? "IA" : "PLAYER");
        }
    }
}

function updateAdvancedIA() {
    if (!iaBike.alive) return;
    let possibleDirs = [0, 1, 2, 3];
    possibleDirs = possibleDirs.filter(d => d !== (iaBike.direction + 2) % 4);
    let safeDirs = possibleDirs.filter(d => {
        let nx = iaBike.x, ny = iaBike.y;
        if (d === 0) ny--; if (d === 1) nx++; if (d === 2) ny++; if (d === 3) nx--;
        return nx >= 0 && nx < WIDTH_UNITS && ny >= 0 && ny < HEIGHT_UNITS && !gridData[nx][ny];
    });

    if (safeDirs.length > 0) {
        let bestDir = safeDirs[0];
        let minDist = Infinity;
        safeDirs.forEach(d => {
            let nx = iaBike.x, ny = iaBike.y;
            if (d === 0) ny--; if (d === 1) nx++; if (d === 2) ny++; if (d === 3) nx--;
            let dist = Math.abs(nx - playerBike.x) + Math.abs(ny - playerBike.y);
            if (dist < minDist) {
                minDist = dist;
                bestDir = d;
            }
        });
        if (Math.random() > 0.05) iaBike.direction = bestDir;
    }
}

const playerBike = new Bike(WIDTH_UNITS * 0.2, 25, GRID_COLOR, 1, true);
const iaBike = new Bike(WIDTH_UNITS * 0.8, 25, "#ff9f43", 3, false);

function drawPerspectiveBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#000");
    gradient.addColorStop(0.4, HORIZON_COLOR);
    gradient.addColorStop(1, "#000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;

    for (let i = 0; i < 20; i++) {
        let y = (Math.pow(1.2, i + gridOffset) * 10) + VANISHING_POINT_Y;
        if (y > canvas.height) continue;
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
    }
    const numVerticals = 30;
    for (let i = 0; i < numVerticals; i++) {
        const baseX = (canvas.width / numVerticals) * i;
        ctx.moveTo(canvas.width / 2, VANISHING_POINT_Y); ctx.lineTo(baseX, canvas.height);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // --- DIBUJAR UI DE TIEMPO Y NIVEL ---
    ctx.fillStyle = "#fff";
    ctx.font = "14px 'Courier New'";
    ctx.fillText(`NIVEL: ${nivel}`, 20, 30);
    ctx.fillText(`TIEMPO: ${tiempoSobrevivido}s`, 20, 50);
    ctx.fillText(`RECORD: ${puntajeMaximo}s`, 20, 70);
}

function gameLoop() {
    drawPerspectiveBackground();
    if (gameRunning) {
        gridOffset = (gridOffset + 0.05) % 1;
        updateAdvancedIA();
        playerBike.update();
        iaBike.update();

        if (playerBike.x === iaBike.x && playerBike.y === iaBike.y) {
            playerBike.alive = false;
            iaBike.alive = false;
            endGame("IA"); 
        } else {
            let pDead = playerBike.checkDeath();
            let iDead = iaBike.checkDeath();
            if (pDead && iDead) endGame("IA");
            else if (pDead) playerBike.kill();
            else if (iDead) iaBike.kill();
        }
    }
    playerBike.draw();
    iaBike.draw();
    
    // La velocidad ahora depende de la variable gameSpeed
    setTimeout(() => requestAnimationFrame(gameLoop), gameSpeed); 
}

function endGame(winner) {
    gameRunning = false;
    clearInterval(intervaloTiempo);

    // Guardar record
    if (tiempoSobrevivido > puntajeMaximo) {
        puntajeMaximo = tiempoSobrevivido;
        localStorage.setItem('tronMaxScore', puntajeMaximo);
    }

    if (winner === "IA") {
        statusEl.innerText = "HAS SIDO VENCIDO POR GLU";
        statusEl.className = "text-danger fw-bold";
        instrText.innerHTML = `<p class='text-danger'>FIN DE LA TRANSMISIÓN. <br><br>Sobreviviste ${tiempoSobrevivido} segundos. <br>Presiona ESPACIO para reiniciar.</p>`;
    } else {
        statusEl.innerText = "GLU PURGADO";
        statusEl.className = "text-success fw-bold";
        instrText.innerHTML = `<p class='text-success'>¡VICTORIA! <br><br>Nivel ${nivel} superado. <br>Presiona ESPACIO para continuar.</p>`;
    }
}

function resetGame() {
    // Si el jugador ganó, subimos de nivel (máximo 3)
    if (!playerBike.alive) {
        nivel = 1;
        gameSpeed = 80;
    } else if (gameRunning === false && iaBike.alive === false) {
        if (nivel < 3) nivel++;
        // Ajuste de dificultad (Velocidad)
        if (nivel === 2) gameSpeed = 50; // Un poco más rápido
        if (nivel === 3) gameSpeed = 30; // Rápido (reflejos veloces)
    }

    gridData = Array.from({length: WIDTH_UNITS}, () => Array(HEIGHT_UNITS).fill(null));
    playerBike.reset(WIDTH_UNITS * 0.2, 25, 1);
    iaBike.reset(WIDTH_UNITS * 0.8, 25, 3);
    
    tiempoSobrevivido = 0;
    clearInterval(intervaloTiempo);
    intervaloTiempo = setInterval(() => {
        if (gameRunning) tiempoSobrevivido++;
    }, 1000);

    statusEl.innerText = `ACTIVE - NIVEL ${nivel}`; 
    statusEl.className = "text-success fw-bold";
    instrText.innerHTML = `<p class='text-cyan'>NIVEL ${nivel} EN CURSO... <br><br>La velocidad del Grid ha aumentado.</p>`;
    gameRunning = true;
}

document.addEventListener('keydown', (e) => {
    if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
    if (e.code === "Space" && (step >= 3 || !gameRunning)) resetGame();
    if (!gameRunning) return;
    if (e.key === "ArrowUp" && playerBike.direction !== 2) playerBike.direction = 0;
    if (e.key === "ArrowRight" && playerBike.direction !== 3) playerBike.direction = 1;
    if (e.key === "ArrowDown" && playerBike.direction !== 0) playerBike.direction = 2;
    if (e.key === "ArrowLeft" && playerBike.direction !== 1) playerBike.direction = 3;
});

gameLoop();