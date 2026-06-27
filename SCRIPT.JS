/* ===================================
   CORRIDA TURBO - SCRIPT.JS
=================================== */

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const gameOver = document.getElementById("gameOver");

const player = document.getElementById("player");
const road = document.getElementById("road");

const scoreElement = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const recordElement = document.getElementById("record");

const lines = document.querySelectorAll(".line");

let score = 0;
let speed = 6;
let gameRunning = false;

let playerX = 175;

let keys = {};

let enemies = [];

let lineOffset = 0;

let record = Number(localStorage.getItem("recordCorrida")) || 0;
recordElement.innerText = record;

/* ===========================
   CONTROLES
=========================== */

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

/* ===========================
   BOTÕES
=========================== */

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

/* ===========================
   INICIAR JOGO
=========================== */

function startGame(){

    menu.style.display = "none";
    gameOver.style.display = "none";

    score = 0;
    speed = 6;

    playerX = 175;
    player.style.left = playerX + "px";

    scoreElement.innerText = "0";

    enemies.forEach(enemy => enemy.remove());
    enemies = [];

    createEnemy();

    gameRunning = true;

    requestAnimationFrame(update);

}

/* ===========================
   CRIAR CARRO INIMIGO
=========================== */

function createEnemy(){

    const enemy = document.createElement("div");

    enemy.className = "enemy";
    enemy.innerHTML = "🚙";

    enemy.style.position = "absolute";
    enemy.style.fontSize = "60px";

    const lanes = [45, 175, 305];
    enemy.style.left =
        lanes[Math.floor(Math.random() * lanes.length)] + "px";

    enemy.style.top = "-100px";

    road.appendChild(enemy);

    enemies.push(enemy);

}
/* ===========================
   LOOP PRINCIPAL
=========================== */

function update(){

    if(!gameRunning) return;

    // Movimento do jogador
    if(keys["ArrowLeft"] && playerX > 20){
        playerX -= 7;
    }

    if(keys["ArrowRight"] && playerX < 340){
        playerX += 7;
    }

    player.style.left = playerX + "px";

    // Movimento da estrada
    moveRoad();

    // Movimento dos carros inimigos
    moveEnemies();

    // Pontuação
    score += 0.1;
    scoreElement.innerText = Math.floor(score);

    // Recorde
    if(score > record){
        record = Math.floor(score);
        recordElement.innerText = record;
        localStorage.setItem("recordCorrida", record);
    }

    // Aumento gradual da velocidade
    speed += 0.0005;

    requestAnimationFrame(update);

}

/* ===========================
   ANIMAÇÃO DAS FAIXAS
=========================== */

function moveRoad(){

    lineOffset += speed;

    lines.forEach((line, index)=>{

        line.style.top =
            ((index * 220) + lineOffset) % 880 - 120 + "px";

    });

}

/* ===========================
   MOVIMENTO DOS INIMIGOS
=========================== */

function moveEnemies(){

    enemies.forEach((enemy, index)=>{

        enemy.style.top =
            (enemy.offsetTop + speed) + "px";

        // Saiu da tela
        if(enemy.offsetTop > 760){

            enemy.remove();

            enemies.splice(index,1);

            createEnemy();

            return;
        }

        // Colisão
        const p = player.getBoundingClientRect();
        const e = enemy.getBoundingClientRect();

        if(
            p.left < e.right &&
            p.right > e.left &&
            p.top < e.bottom &&
            p.bottom > e.top
        ){
            finishGame();
        }

    });

}/* ===========================
   GAME OVER
=========================== */

function finishGame(){

    if(!gameRunning) return;

    gameRunning = false;

    finalScore.innerText = Math.floor(score);

    if(score > record){

        record = Math.floor(score);

        localStorage.setItem("recordCorrida", record);

        recordElement.innerText = record;

    }

    gameOver.style.display = "flex";

}

/* ===========================
   CONTROLES POR TOQUE (CELULAR)
=========================== */

let touchStartX = 0;

document.addEventListener("touchstart", (e)=>{

    touchStartX = e.touches[0].clientX;

});

document.addEventListener("touchmove", (e)=>{

    if(!gameRunning) return;

    const touchX = e.touches[0].clientX;
    const delta = touchX - touchStartX;

    playerX += delta * 0.15;

    if(playerX < 20) playerX = 20;
    if(playerX > 340) playerX = 340;

    player.style.left = playerX + "px";

    touchStartX = touchX;

}, { passive: true });

/* ===========================
   IMPEDIR SELEÇÃO DE TEXTO
=========================== */

document.addEventListener("dragstart", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());

/* ===========================
   FIM DO SCRIPT
=========================== */
