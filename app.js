document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector(".body");
  const grid = document.querySelector(".grid");
  const scoreDisplay = document.querySelector("span");
  let startBtn = document.querySelector(".start");
  let snakeHead = "snakeHeadRight";
  let temporarySnakeHead = "snakeHeadRight";
  let squares;
  let timeouts = null;

  const width = 20;
  let currentIndex = 0;
  let appleIndex = 0;
  let currentSnake = [2, 1, 0];
  let direction = 1;
  let score = 0;
  let speed = 1.02;
  let intervalTime = 200;
  let interval = 0;
  let paused;

  const startGame = () => {
    body.style.cursor = "none";
    startBtn.style.cursor = "none";
    while (grid.firstChild && grid.removeChild(grid.firstChild));
    for (let i = 0; i < 400; i++) {
      let div = document.createElement("div");
      grid.appendChild(div);
    }
    squares = document.querySelectorAll(".grid div");
    currentSnake.forEach((index) => squares[index].classList.remove("snake"));
    squares[appleIndex].classList.remove("apple");
    clearInterval(interval);
    score = 0;
    randomApple();
    direction = 1;
    scoreDisplay.innerText = score;
    intervalTime = 200;
    currentSnake = [2, 1, 0];
    currentIndex = 0;
    snakeHead = "snakeHeadRight";
    paused = false;
    currentSnake.forEach((el, index) =>
      index === 0
        ? squares[el].classList.add(snakeHead)
        : squares[el].classList.add("snake")
    );
    interval = setInterval(moveOutcomes, intervalTime);
  };

  const moveOutcomes = () => {
    if (!paused) {
      //   deals with snake hitting border or snake hitting self
      if (
        (currentSnake[0] + width >= width * width && direction === width) || //if snake hits bottom
        (currentSnake[0] % width === width - 1 && direction === 1) || //if snake hits right wall
        (currentSnake[0] % width === 0 && direction === -1) || // if snake hits left wall
        (currentSnake[0] - width < 0 && direction === -width) || // if snake hits the top
        squares[currentSnake[0] + direction].classList.contains("snake") // if snake goes into itself
      ) {
        return clearInterval(interval);
      }

      const tail = currentSnake.pop();
      squares[tail].classList.remove("snake");
      currentSnake.unshift(currentSnake[0] + direction);
      // gives direction to the head

      //   deals with snake getting the apple
      if (squares[currentSnake[0]].classList.contains("apple")) {
        squares[currentSnake[0]].classList.remove("apple");
        squares[tail].classList.add("snake");
        currentSnake.push(tail);
        randomApple();
        score++;
        scoreDisplay.textContent = score;
        clearInterval(interval);
        intervalTime =
          currentSnake.length % 10 === 0 ? intervalTime * speed : intervalTime;
        interval = setInterval(moveOutcomes, intervalTime);
      }
      squares[currentSnake[1]].classList.remove(temporarySnakeHead);
      temporarySnakeHead = snakeHead;
      squares[currentSnake[1]].classList.add("snake");
      squares[currentSnake[0]].classList.add(snakeHead);
    }
  };

  //generate new apple once apple is eaten
  const randomApple = () => {
    do {
      appleIndex = Math.floor(Math.random() * 400);
    } while (squares[appleIndex].classList.contains("snake"));
    squares[appleIndex].classList.add("apple");
  };

  const controlSnake = (e) => {
    temporarySnakeHead = squares[currentSnake[0]].classList[0];
    e.preventDefault();
    switch (e.keyCode) {
      case 39:
        direction = 1;
        snakeHead = "snakeHeadRight";
        paused && (paused = !paused);
        break;
      case 38:
        direction = -width;
        snakeHead = "snakeHeadUp";
        paused && (paused = !paused);
        break;
      case 37:
        direction = -1;
        snakeHead = "snakeHeadLeft";
        paused && (paused = !paused);
        break;
      case 40:
        direction = +width;
        snakeHead = "snakeHeadDown";
        paused && (paused = !paused);
        break;
      case 32:
        paused = !paused;
        break;
      default:
        direction = direction;
    }
  };

  document.addEventListener("keyup", controlSnake);
  document.addEventListener("mousemove", () => {
    clearTimeout(timeouts);
    body.style.cursor = "auto";
    startBtn.style.cursor = "auto";
    timeouts = setTimeout(() => {
      body.style.cursor = "none";
      startBtn.style.cursor = "none";
    }, 1000);
  });
  startBtn.addEventListener("click", () => {
    startBtn.blur();
    startGame();
  });
});
