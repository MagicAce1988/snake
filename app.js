const girdSize = 30;
const grid = [];
const startSize = 4;
const dirNames = {
  1: "top",
  2: "right",
  3: "bottom",
  4: "left",
};
const dirAxis = {
  1: [-1, 0],
  2: [0, 1],
  3: [1, 0],
  4: [0, -1],
};

let snake = [];
let currDir = 2;
let nextDir = 2;
let interval;

const computeNext = () => {
  let last = snake[snake.length - 1];
  let currHead = grid[last[0]][last[1]];

  if (nextDir != currDir) {
    currHead.classList = `cell snake ${dirNames[currDir]}-${dirNames[nextDir]}`;
    currDir = nextDir;
  } else currHead.classList.remove("head");

  let currAxis = dirAxis[currDir];
  let newPart = [last[0] + currAxis[0], last[1] + currAxis[1]];
  let nextHead = (grid[newPart[0]] || [])[newPart[1]];

  //game over bitch wall
  if (
    newPart[0] == girdSize ||
    newPart[1] == girdSize ||
    newPart[0] == -1 ||
    newPart[1] == -1 ||
    nextHead.classList.contains("snake")
  ) {
    document.querySelector(".title").textContent = "Game over bitch";
    return clearInterval(interval);
  } else if (!nextHead.classList.contains("apple")) {
    let first = snake.shift();
    let tail = grid[first[0]][first[1]];
    tail.className = "cell";

    let second = snake[0];
    let newTail = grid[second[0]][second[1]];
    newTail.classList.add("tail");
  } else {
    addNextApple();
  }

  nextHead.className = "cell snake head " + dirNames[currDir];
  snake.push(newPart);
};

const startGame = () => {
  createWorld();
  createStartSnake();
  addNextApple();
  interval = setInterval(() => computeNext(), 140);
};

addNextApple = () => {
  let cell =
    grid[Math.floor(Math.random() * girdSize)][
      Math.floor(Math.random() * girdSize)
    ];
  if (cell.classList.length > 1) addNextApple();
  else cell.classList.add("apple");
};

const createStartSnake = () => {
  snake = new Array(startSize);
  for (let index = 0; index < startSize; index++) {
    snake[index] = [0, index];
    grid[0][index].className = "cell snake " + dirNames[2];
    if (index === startSize - 1) grid[0][index].className += " head";
  }
};

const createWorld = () => {
  const content = document.querySelector(".grid");
  while (content.lastChild) content.removeChild(content.lastChild);

  for (let y = 0; y < girdSize; y++) {
    const row = document.createElement("div");
    row.className = "row";
    content.appendChild(row);
    grid[y] = new Array();

    for (let x = 0; x < girdSize; x++) {
      grid[y][x] = document.createElement("div");
      grid[y][x].className = "cell";
      row.append(grid[y][x]);
    }
  }
};

setupControls = () => {
  document.addEventListener("keyup", (e) => {
    if (e.code == "Space") {
      if (interval) {
        clearInterval(interval);
        interval = null;
      } else {
        interval = setInterval(() => computeNext(), 140);
      }
    } else {
      let dir = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].indexOf(
        e.code
      );
      nextDir = dir >= 0 && (dir + 1) % 2 !== currDir % 2 ? dir + 1 : nextDir;
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setupControls();
  startGame();
});
