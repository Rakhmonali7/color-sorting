//1 ВХОДНЫЕ ДАННЫЕ
const CAPACITY = 2; // максимальная высота пробирки
const initialBoard = [
  ['red', 'blue'], // tube 0: bottom red, top blue
  ['blue', 'red'], // tube 1: bottom blue, top red
  [], // tube 2: empty
  [], // tube 3: empty
];
// Важно: "верх" — последний элемент массива. Пустая пробирка — [].

// 2 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ СОСТОЯНИЯ

/** Копируем доску (пробирки) */
function copyBoard(board) {
  return board.map(tube => tube.slice());
}

/** Сериализация состояния для Set */
function makeKey(board) {
  return board.map(tube => tube.join('|')).join('||');
}

/** Сколько мест осталось в пробирке */
function spaceLeft(tube, cap) {
  return cap - tube.length;
}

/** Верхний блок одинакового цвета */
function topBlock(tube) {
  if (tube.length === 0) return { color: null, height: 0 };
  const color = tube[tube.length - 1];
  let height = 1;
  for (let i = tube.length - 2; i >= 0 && tube[i] === color; i--) height++;
  return { color, height };
}

/** Проверка: все пробирки либо пустые, либо полные одним цветом */
function isSolved(board, cap) {
  return board.every(
    tube =>
      tube.length === 0 ||
      (tube.length === cap && tube.every(x => x === tube[0]))
  );
}

// 3) ПРАВИЛА ПЕРЕЛИВА

/** Проверка: можно ли перелить */
function canMove(source, target, cap) {
  if (source.length === 0) return false;
  if (spaceLeft(target, cap) === 0) return false;
  const { color } = topBlock(source);
  const topTarget = target.length ? target[target.length - 1] : null;
  return topTarget === null || topTarget === color;
}

/** Сделать ход: перелить блок сверху */
function doMove(board, from, to, cap) {
  const nextBoard = copyBoard(board);
  const source = nextBoard[from];
  const target = nextBoard[to];

  const { color, height } = topBlock(source);
  if (color === null) return { nextBoard, poured: 0 };

  const amount = Math.min(height, spaceLeft(target, cap));
  for (let i = 0; i < amount; i++) target.push(source.pop());

  return { nextBoard, poured: amount };
}

// 4 DFS С ПОСЕЩЁННЫМИ СОСТОЯНИЯМИ

function solvePuzzle(startBoard, cap, maxDepth = 50) {
  const visited = new Set();
  const movesPath = [];

  function dfs(board, depth, lastMove) {
    if (isSolved(board, cap)) return true;
    if (depth >= maxDepth) return false;

    const key = makeKey(board);
    if (visited.has(key)) return false;
    visited.add(key);

    const n = board.length;
    for (let from = 0; from < n; from++) {
      for (let to = 0; to < n; to++) {
        if (from === to) continue;
        if (!canMove(board[from], board[to], cap)) continue;
        if (lastMove && lastMove[0] === to && lastMove[1] === from) continue;

        const { nextBoard, poured } = doMove(board, from, to, cap);
        if (poured === 0) continue;

        movesPath.push([from, to]);
        if (dfs(nextBoard, depth + 1, [from, to])) return true;
        movesPath.pop();
      }
    }
    return false;
  }

  return dfs(startBoard, 0, null) ? movesPath : null;
}

// 5 ЗАПУСК
const moves = solvePuzzle(initialBoard, CAPACITY);
if (!moves) {
  console.log('Нет решения.');
} else {
  console.log('Ходы:', moves.map(([a, b]) => `(${a}→${b})`).join(' '));
}
