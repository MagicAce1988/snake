document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector(".body");
  const grid = document.querySelector(".grid");
  const scoreDisplay = document.querySelector("span");
  let startBtn = document.querySelector(".start");
  let squares;
  let timeouts = null;
  let inProgress = false;

  const width = 20;
  let currentIndex = 0;
  let appleIndex = 0;
  let currentSnake = [2, 1, 0];
  let movingDirection = 1;
  let imagesDirection = "right";
  let movedDirection = false;
  let mirror = false;
  let flip = false;
  let mirrorAndFlip = false;
  let score = 0;
  let speed = 1.02;
  let intervalTime = 200;
  let interval = 0;
  let paused;
  let tailDirection;

  const startGame = () => {
    body.style.cursor = "none";
    startBtn.style.cursor = "none";
    while (grid.firstChild && grid.removeChild(grid.firstChild));
    for (let i = 0; i < 400; i++) {
      let div = document.createElement("div");
      grid.appendChild(div);
    }
    squares = document.querySelectorAll(".grid div");
    squares[appleIndex].classList.remove("apple");
    clearInterval(interval);
    score = 0;
    randomApple();
    movingDirection = 1;
    imagesDirection = "right";
    tailDirection = "right";
    scoreDisplay.innerText = score;
    intervalTime = 200;
    currentSnake = [2, 1, 0];
    currentIndex = 0;
    movedDirection = false;
    mirror = false;
    flip = false;
    mirrorAndFlip = false;
    inProgress = false;
    paused = false;
    timeouts = null;
    currentSnake.forEach((el, index) => {
      index === 0
        ? squares[el].classList.add("snakeHead")
        : index === currentSnake.length - 1
        ? squares[el].classList.add("snakeTail")
        : squares[el].classList.add("snake");
      squares[el].classList.add(imagesDirection);
    });
    interval = setInterval(moveOutcomes, intervalTime);
  };

  const moveOutcomes = () => {
    if (!paused) {
      //   deals with snake hitting border or snake hitting self
      if (
        (currentSnake[0] + width >= width * width &&
          movingDirection === width) || //if snake hits bottom
        (currentSnake[0] % width === width - 1 && movingDirection === 1) || //if snake hits right wall
        (currentSnake[0] % width === 0 && movingDirection === -1) || // if snake hits left wall
        (currentSnake[0] - width < 0 && movingDirection === -width) || // if snake hits the top
        squares[currentSnake[0] + movingDirection].classList.contains(
          "snake"
        ) || // if snake goes into itself
        squares[currentSnake[0] + movingDirection].classList.contains(
          "snakeHead"
        ) // if snake tries to go backwards
      ) {
        return clearInterval(interval);
      }

      const tail = currentSnake.pop();
      tailDirection = squares[
        currentSnake[currentSnake.length - 2]
      ].classList.contains("snakeCorner")
        ? tailDirection
        : squares[currentSnake[currentSnake.length - 2]].classList.item(1);

      squares[tail].removeAttribute("class");
      currentSnake.unshift(currentSnake[0] + movingDirection);
      // gives movingDirection to the head

      //   deals with snake getting the apple
      if (squares[currentSnake[0]].classList.contains("apple")) {
        squares[currentSnake[0]].classList.remove("apple");
        squares[tail].classList.add("snake");
        squares[tail].classList.add(tailDirection);
        currentSnake.push(tail);
        randomApple();
        score++;
        scoreDisplay.textContent = score;
        clearInterval(interval);
        intervalTime =
          currentSnake.length % 10 === 0 ? intervalTime * speed : intervalTime;
        interval = setInterval(moveOutcomes, intervalTime);
      }
      squares[currentSnake[1]].removeAttribute("class");
      if (movedDirection) {
        squares[currentSnake[1]].classList.add("snakeCorner");
        mirror && squares[currentSnake[1]].classList.add("mirror");
        flip && squares[currentSnake[1]].classList.add("flipSide");
        mirrorAndFlip &&
          squares[currentSnake[1]].classList.add("mirrorFlipSide");
        movedDirection = false;
        mirror = false;
        flip = false;
        mirrorAndFlip = false;
      } else {
        squares[currentSnake[1]].classList.add("snake", imagesDirection);
      }
      squares[currentSnake[0]].classList.add("snakeHead", imagesDirection);
      squares[currentSnake[currentSnake.length - 1]].removeAttribute("class");
      squares[currentSnake[currentSnake.length - 1]].classList.add(
        "snakeTail",
        tailDirection
      );
    }
  };

  //generate new apple once apple is eaten
  const randomApple = () => {
    do {
      appleIndex = Math.floor(Math.random() * 400);
    } while (
      squares[appleIndex].classList.contains("snake") ||
      squares[appleIndex].classList.contains("snakeHead") ||
      squares[appleIndex].classList.contains("snakeCorner") ||
      squares[appleIndex].classList.contains("snakeTail")
    );
    squares[appleIndex].classList.add("apple");
  };

  const controlSnake = (e) => {
    e.preventDefault();
    switch (e.keyCode) {
      case 39:
        imagesDirection === "down" && movingDirection !== 1 && (flip = true);
        movedDirection = movingDirection === 1 ? false : true;
        movingDirection = 1;
        imagesDirection = "right";
        paused && (paused = !paused);
        break;
      case 38:
        imagesDirection === "left" &&
          movingDirection !== -width &&
          (flip = true);
        imagesDirection === "right" &&
          movingDirection !== -width &&
          (mirrorAndFlip = true);
        movedDirection = movingDirection === -width ? false : true;
        movingDirection = -width;
        imagesDirection = "up";
        paused && (paused = !paused);
        break;
      case 37:
        imagesDirection === "down" &&
          movingDirection !== -1 &&
          (mirrorAndFlip = true);
        imagesDirection === "up" && movingDirection !== -1 && (mirror = true);
        movedDirection = movingDirection === -1 ? false : true;
        movingDirection = -1;
        imagesDirection = "left";
        paused && (paused = !paused);
        break;
      case 40:
        imagesDirection === "right" &&
          movingDirection !== +width &&
          (mirror = true);
        movedDirection = movingDirection === +width ? false : true;
        movingDirection = +width;
        imagesDirection = "down";
        paused && (paused = !paused);
        break;
      case 32:
        paused = !paused;
        break;
      default:
        movingDirection = movingDirection;
        imagesDirection = imagesDirection;
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
