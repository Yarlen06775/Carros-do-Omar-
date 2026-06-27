/* ===================================
   CORRIDA TURBO - SCRIPT.JS
=================================== */

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const gameOver = document.getElementById("gameOver");

const player = document.getElementById("player");

const scoreElement = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const recordElement = document.getElementById("record");

const lines = document.querySelectorAll(".line");

let score = 0;
let speed = 6;
let gameRunning = false;

let playerX = 175;

let keys = {};

let record = localStorage.getItem("recordCorrida") || 0;
recordElement.innerText = record;

/* ========================= */

document.addEventListener("keydown", e => {
    keys[e.key] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

/* ========================= */

startBtn.onclick = startGame;
restartBtn.onclick = startGame;

function startGame(){

    menu.style.display = "none";
    gameOver.style.display = "none";

    score = 0;
    speed = 6;

    playerX = 175;

    player.style.left = playerX + "px";

    gameRunning = true;

    requestAnimationFrame(update);

}

/* ========================= */

function update(){

    if(!gameRunning) return;

    if(keys["ArrowLeft"] && playerX > 20){
        playerX -= 6;
    }

    if(keys["ArrowRight"] && playerX < 340){
        playerX += 6;
    }

    player.style.left = playerX + "px";

    moveRoad();

    score += 0.1;

    scoreElement.innerText = Math.floor(score);

    if(score > record){
        record = Math.floor(score);
        localStorage.setItem("recordCorrida", record);
        recordElement.innerText = record;
    }

    speed += 0.0005;

    requestAnimationFrame(update);

}

/* ========================= */

let lineOffset = 0;

function moveRoad(){

    lineOffset += speed;

    lines.forEach((line,index)=>{

        line.style.top =
        ((index*220)+lineOffset)%880-120+"px";

    });

}

/* ========================= */

function finishGame(){

    gameRunning = false;

    finalScore.innerText = Math.floor(score);

    gameOver.style.display = "flex";

}
