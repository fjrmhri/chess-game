import { Chess, Color, Move } from "chess.js";

const pieceValues: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const pieceSquareTables: Record<string, number[]> = {
  p: [
    0, 0, 0, 0, 0, 0, 0, 0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
    5, 5, 10, 27, 27, 10, 5, 5,
    0, 0, 0, 25, 25, 0, 0, 0,
    5, -5, -10, 0, 0, -10, -5, 5,
    5, 10, 10, -25, -25, 10, 10, 5,
    0, 0, 0, 0, 0, 0, 0, 0,
  ],
  n: [
    -50, -40, -30, -30, -30, -30, -40, -50,
    -40, -20, 0, 0, 0, 0, -20, -40,
    -30, 0, 10, 15, 15, 10, 0, -30,
    -30, 5, 15, 20, 20, 15, 5, -30,
    -30, 0, 15, 20, 20, 15, 0, -30,
    -30, 5, 10, 15, 15, 10, 5, -30,
    -40, -20, 0, 5, 5, 0, -20, -40,
    -50, -40, -30, -30, -30, -30, -40, -50,
  ],
  b: [
    -20, -10, -10, -10, -10, -10, -10, -20,
    -10, 5, 0, 0, 0, 0, 5, -10,
    -10, 10, 10, 10, 10, 10, 10, -10,
    -10, 0, 10, 10, 10, 10, 0, -10,
    -10, 5, 5, 10, 10, 5, 5, -10,
    -10, 0, 5, 10, 10, 5, 0, -10,
    -10, 0, 0, 0, 0, 0, 0, -10,
    -20, -10, -10, -10, -10, -10, -10, -20,
  ],
  r: [
    0, 0, 0, 0, 0, 0, 0, 0,
    5, 10, 10, 10, 10, 10, 10, 5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    0, 0, 0, 5, 5, 0, 0, 0,
  ],
  q: [
    -20, -10, -10, -5, -5, -10, -10, -20,
    -10, 0, 0, 0, 0, 5, 0, -10,
    -10, 0, 5, 5, 5, 5, 5, -10,
    -5, 0, 5, 5, 5, 5, 0, -5,
    0, 0, 5, 5, 5, 5, 0, -5,
    -10, 5, 5, 5, 5, 5, 0, -10,
    -10, 0, 5, 0, 0, 0, 0, -10,
    -20, -10, -10, -5, -5, -10, -10, -20,
  ],
  k: [
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -20, -30, -30, -40, -40, -30, -30, -20,
    -10, -20, -20, -20, -20, -20, -20, -10,
    20, 20, 0, 0, 0, 0, 20, 20,
    20, 30, 10, 0, 0, 10, 30, 20,
  ],
};

function evaluateBoard(chess: Chess, forColor: Color): number {
  let score = 0;
  const board = chess.board();

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const piece = board[row][col];
      if (!piece) continue;

      const type = piece.type;
      const baseValue = pieceValues[type] ?? 0;
      const table = pieceSquareTables[type];
      const index = piece.color === "w" ? row * 8 + col : 63 - (row * 8 + col);
      const positionalBonus = table ? table[index] : 0;
      const materialScore = baseValue + positionalBonus;
      score += piece.color === forColor ? materialScore : -materialScore;
    }
  }

  // Encourage mobility and tempo while avoiding exposed kings
  const mobility = chess.moves({ verbose: true }).length;
  score += mobility * 2;
  if (chess.inCheck()) {
    score -= 75;
  }

  if (chess.isCheckmate()) {
    return -Infinity;
  }

  return score;
}

function orderMoves(moves: Move[]): Move[] {
  return moves
    .map((move) => {
      const isCapture = typeof move.captured !== "undefined";
      const isPromotion = Boolean((move as Move & { promotion?: string }).promotion);
      const captureValue = move.captured ? pieceValues[move.captured] ?? 0 : 0;
      const movingValue = pieceValues[(move.piece as string) ?? ""] ?? 0;
      const priority = (isCapture ? captureValue - movingValue : 0) + (isPromotion ? 300 : 0);
      const san = (move as Move & { san?: string }).san;
      const isChecking = san?.includes("+") ?? false;
      return { move, score: priority + (isChecking ? 50 : 0) };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.move as Move & { color: Color });
}

function negamax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizingColor: Color,
  startTime: number,
  timeLimitMs: number
): number {
  if (performance.now() - startTime > timeLimitMs) {
    return evaluateBoard(chess, maximizingColor);
  }

  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess, maximizingColor);
  }

  const moves = orderMoves(chess.moves({ verbose: true }) as Move[]);
  let bestScore = -Infinity;

  for (const move of moves) {
    chess.move(move);
    const score = -negamax(chess, depth - 1, -beta, -alpha, maximizingColor, startTime, timeLimitMs);
    chess.undo();

    bestScore = Math.max(bestScore, score);
    alpha = Math.max(alpha, score);

    if (alpha >= beta || performance.now() - startTime > timeLimitMs) {
      break;
    }
  }

  return bestScore;
}

export function findBestMove(chess: Chess, color: Color, maxDepth = 4, timeLimitMs = 1200): Move | null {
  const start = performance.now();
  const moves = orderMoves(chess.moves({ verbose: true }) as Move[]);
  let bestMove: Move | null = null;
  let bestEval = -Infinity;

  for (let depth = 1; depth <= maxDepth; depth += 1) {
    for (const move of moves) {
      chess.move(move);
      const evaluation = -negamax(chess, depth - 1, -Infinity, Infinity, color, start, timeLimitMs);
      chess.undo();

      if (evaluation > bestEval) {
        bestEval = evaluation;
        bestMove = move;
      }
    }

    if (performance.now() - start > timeLimitMs * 0.9) {
      break;
    }
  }

  return bestMove ?? ((moves[0] as Move) || null);
}
