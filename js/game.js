const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const grid = 16;
let count = 0;

let snake = {
    x: 160,
    y: 160,

    // Скорость змейки по горизонтали и вертикали. Сначала она стоит на месте.
    dx: grid,
    dy: 0,

    // Массив ячеек, который будет хранить тело змейки
    cells: [],

    // Стартовая длина змейки
    maxCells: 4
};

let apple = {
    x: 320,
    y: 320
};

// Функция для получения случайных чисел в заданном диапазоне
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Игровой цикл
function loop() {
    requestAnimationFrame(loop);

    // Замедляем скорость игры
    if (++count < 4) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Двигаем змейку
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Проверяем края экрана и создаем эффект портала
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // Добавляем текущую позицию головы змейки в начало массива
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // Удаляем ячейки, если длина больше максимальной
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Рисуем яблоко
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Рисуем змейку
    context.fillStyle = 'green';
    snake.cells.forEach(function (cell, index) {

        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // Если змейка съела яблоко
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;

            // Размещаем яблоко в новом случайном месте
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }

// Проверяем столкновение с самим собой
for (let i = index + 1; i < snake.cells.length; i++) {
    if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        // Отправляем текущий счет перед сбросом игры
        sendScore(snake.maxCells - 4);

        // Сброс игры
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
    }
}


// Управление змейкой с помощью клавиатуры
document.addEventListener('keydown', function (e) {
    // Левая стрелка
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    // Вверх
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // Правая стрелка
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // Вниз
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, false);

canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    // Определяем направление свайпа
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && snake.dx === 0) {
            snake.dx = grid;
            snake.dy = 0;
        } else if (deltaX < 0 && snake.dx === 0) {
            snake.dx = -grid;
            snake.dy = 0;
        }
    } else {
        if (deltaY > 0 && snake.dy === 0) {
            snake.dy = grid;
            snake.dx = 0;
        } else if (deltaY < 0 && snake.dy === 0) {
            snake.dy = -grid;
            snake.dx = 0;
        }
    }

    // Обновляем стартовые координаты
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, false);
function sendScore(score) {
    if (window.Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify({ score: score }));
    }
}


// Запускаем игру
requestAnimationFrame(loop);
