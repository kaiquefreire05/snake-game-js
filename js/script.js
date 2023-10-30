const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); // contexto vai ser em 2d

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span"); // encontrando o span
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio("../assets/audio.mp3"); // ... , serve para sair da pasta js

// fillRect = desenhando elemento, X Y H W
// fillStyle = cor do que vai ser inserido
/* () => {}, é uma arrow function, serve como uma função mas de forma mais compacta
 e para objetivos simples, pode receber parâmetros, pode ser chamada em qualquer lugar do código 
 ou em um comando como na linha 22 
*/

const size = 30; // tamanho de cada elemento da cobrinha e comida

const initialPosition = { x: 270, y: 240 }; // posição inicial da snake na tela

let snake = [initialPosition];

// função que incrementa o score
const incrementScore = () => {
    score.innerText = +score.innerText + 10;
    // valor entre parametro_max e paramentro_min
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
    // essa linha acima serve pra arredondar o número gerado(que concerteza vai ser quebrado) e multiplicar por 30 para eles ser múltiplo de 30

}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
}

const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId;
/*
 direction, essa variavel é a mesma que chama o jogo principal, mas como ela é limpa na função gameLoop ela precisa ser inicializada para não dar erro.
 ela é limpa todas vez que chama o gameLoop para evitar bugs, como ter essas 2 mesmas funções rodando no site
*/

// desenhando a comida
const drawFood = () => {
    // para não ficar chamando o objeto food
    const { x, y, color } = food;
    
    ctx.shadowColor = color; // adicionando cor de sombra
    ctx.shadowBlur = 6; // adiconando blur
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0; // obrigatório zerar o blur para não pegar na página inteira
} 

// desenhando a snake
const drawSnake = () => {
    ctx.fillStyle = "#ddd";

    snake.forEach((position, index) => {
        // printando a cabeça da cobrinha
        if (index == snake.length - 1) {
            ctx.fillStyle = "white";
        }

        ctx.fillRect(position.x, position.y, size, size);
    })
}

// move a snake
const moveSnake = () => {
    if (!direction) return // se não tiver direção ele não faz nada dessa função

    const head = snake[snake.length - 1] // pegando último elemento da array (cabeça)

    // direta 
    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }
    // esquerda
    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }
    // baixo
    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }
    // cima
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift(); // remove o primeiro elemento do array
}

// desenhando linhas para formar um tabuleiro
const drawGrid = () => {
    ctx.lineWidth = 1; // largura da linha
    ctx.strokeStyle = "#191919"; // definindo a cor das linhas

    for (let i = 30; i < canvas.width; i += 30) {
        // linhas verticais
        ctx.beginPath(); // desenha uma linha, para, começa outra linha
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke(); // comando que desenha a linha

        // linhas horizontais
        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
}

// função que verifica se a cobrinha comeu a fruta
const chackEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) { // cobrinha comeu a comida
        incrementScore(); // implementando score
        snake.push(head); // coloca um elemento a+ na cobrinha, coloquei o  head pq tem as mesmas proporções
        audio.play() // som de quando come a fruta

        // gerando posições novas para a comida, o objeto é o mesmo
        let x = randomPosition() 
        let y = randomPosition()

        // garantindo que não vai gerar uma comida no comprimento da cobrinha
        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

// verificando colisão
const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2; // usado para ignorar a cabeça na condição
 
    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) { // colisão parede ou em si mesma
        gameOver(); // termina o jogo
    }
}

// função game over
const gameOver = () => {
    direction = undefined; // para a cobrinha
 
    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)";
}

// função principal que faz o jogo rodar
const gameLoop = () => {
    clearInterval(loopId); // limpa a variável

    ctx.clearRect(0, 0, 600, 600); // limpa retângulo
    drawGrid(); // desenha as linhas
    drawFood(); // desenha a comida
    moveSnake(); // comandos de mover a snake
    drawSnake(); // desenha a snake
    chackEat(); // verifica se comeu a fruta
    checkCollision(); // verifica se houve colisão

    loopId = setTimeout(() => {
        gameLoop();
    }, 300) // velocidade de movimento da snake
}

gameLoop(); // chama o jogo principal

document.addEventListener("keydown", ({ key }) => {
    // adicionando os eventos de mover a snake
    if (key == "ArrowRight" && direction != "left") { // método para a cobrinha não se atravessar
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})
