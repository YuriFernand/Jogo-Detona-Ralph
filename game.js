const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Definindo o personagem e as variáveis do jogo
let player = {
    x: 100,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    isJumping: false,
    color: 'red',
};

let enemy = {
    x: 600,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    speed: 3,  // Velocidade do inimigo
    dx: 0,
    dy: 0,
    color: 'green',
};

let obstacles = [];
let keys = {
    right: false,
    left: false,
    up: false,
};

// Função para desenhar o personagem
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Função para desenhar o inimigo
function drawEnemy() {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

// Função para desenhar obstáculos
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'brown';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Função para criar novos obstáculos
function createObstacle() {
    let x = Math.random() * (canvas.width - 100);
    let width = 50 + Math.random() * 100;
    let height = 20 + Math.random() * 30;
    obstacles.push({ x, y: canvas.height - height, width, height });
}

// Função para atualizar o jogo
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar tela

    drawPlayer(); // Desenhar o personagem
    movePlayer(); // Mover o personagem
    applyGravity(); // Aplicar a gravidade
    drawEnemy(); // Desenhar o inimigo
    moveEnemy(); // Mover o inimigo
    drawObstacles(); // Desenhar obstáculos
    checkCollisions(); // Verificar colisões com obstáculos e inimigo

    requestAnimationFrame(update); // Continuar o loop do jogo
}

// Função para mover o personagem
function movePlayer() {
    if (keys.right) {
        player.dx = player.speed;
    } else if (keys.left) {
        player.dx = -player.speed;
    } else {
        player.dx = 0;
    }

    if (keys.up && !player.isJumping) {
        player.dy = player.jumpPower;
        player.isJumping = true;
    }

    player.x += player.dx;
    player.y += player.dy;

    // Prevenir que o personagem saia da tela
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Função para aplicar a gravidade
function applyGravity() {
    if (player.y + player.height < canvas.height) {
        player.dy += player.gravity;
    } else {
        player.dy = 0;
        player.y = canvas.height - player.height;
        player.isJumping = false;
    }
}

// Função para mover o inimigo
function moveEnemy() {
    // O inimigo segue o jogador com atraso
    if (enemy.x < player.x) {
        enemy.dx = enemy.speed;
    } else if (enemy.x > player.x) {
        enemy.dx = -enemy.speed;
    }

    // O inimigo se move de acordo com a posição do jogador, mas de forma mais lenta
    enemy.x += enemy.dx;

    // Prevenir que o inimigo saia da tela
    if (enemy.x < 0) enemy.x = 0;
    if (enemy.x + enemy.width > canvas.width) enemy.x = canvas.width - enemy.width;
}

// Função para verificar colisões com inimigos e obstáculos
function checkCollisions() {
    // Colisão com o inimigo
    if (player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y) {
        alert("Você perdeu! Colidiu com o inimigo.");
        resetGame();
    }

    // Colisão com obstáculos
    obstacles.forEach((obstacle, index) => {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            obstacles.splice(index, 1); // Remove o obstáculo (destrói)
        }
    });
}

// Função para reiniciar o jogo
function resetGame() {
    player.x = 100;
    player.y = canvas.height - 150;
    player.dx = 0;
    player.dy = 0;
    obstacles = [];
    setTimeout(() => {
        alert("Jogo Reiniciado!");
        createObstacle();
    }, 1000);
}

// Função para lidar com pressionamento de teclas
function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = true;
    }
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = true;
    }
    if (e.key === 'ArrowUp' || e.key === 'w') {
        keys.up = true;
    }
}

// Função para lidar com liberação de teclas
function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = false;
    }
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = false;
    }
    if (e.key === 'ArrowUp' || e.key === 'w') {
        keys.up = false;
    }
}

// Adicionando os ouvintes de eventos de teclado
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

// Criando obstáculos periodicamente
setInterval(createObstacle, 2000);

// Inicializando o jogo
update();
