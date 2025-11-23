import { Chess, Color, Move } from "chess.js";

const pieceValues: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

function evaluateBoard(chess: Chess, forColor: Color): number {
  const board = chess.board();
  let score = 0;

  for (const row of board) {
    for (const piece of row) {
      if (!piece) continue;
      const value = pieceValues[piece.type] ?? 0;
      score += piece.color === forColor ? value : -value;
    }
  }

  // Encourage mobility and discourage leaving your king in check
  const mobility = chess.moves({ verbose: true }).length;
  score += mobility * 2;
  if (chess.inCheck()) {
    score -= 50;
  }

  return score;
}

function minimax(
  chess: Chess,
  depth: number,
  maximizingColor: Color,
  currentColor: Color,
  alpha: number,
  beta: number
): number {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess, maximizingColor);
  }

  const moves = chess.moves({ verbose: true });
  if (currentColor === maximizingColor) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const next = new Chess(chess.fen());
      next.move(move as Move);
      const evaluation = minimax(next, depth - 1, maximizingColor, next.turn(), alpha, beta);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  }

  let minEval = Infinity;
  for (const move of moves) {
    const next = new Chess(chess.fen());
    next.move(move as Move);
    const evaluation = minimax(next, depth - 1, maximizingColor, next.turn(), alpha, beta);
    minEval = Math.min(minEval, evaluation);
    beta = Math.min(beta, evaluation);
    if (beta <= alpha) break;
  }
  return minEval;
}

export function findBestMove(chess: Chess, color: Color, depth = 3): Move | null {
  let bestMove: Move | null = null;
  let bestEvaluation = -Infinity;

  for (const move of chess.moves({ verbose: true })) {
    const next = new Chess(chess.fen());
    next.move(move as Move);
    const evaluation = minimax(next, depth - 1, color, next.turn(), -Infinity, Infinity);
    if (evaluation > bestEvaluation) {
      bestEvaluation = evaluation;
      bestMove = move as Move;
    }
  }

  return bestMove;
}
