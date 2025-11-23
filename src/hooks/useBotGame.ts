"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Chess, Color, Square } from "chess.js";

import { Game, GameStatus } from "@/types";
import { findBestMove } from "@/utils/botEngine";

interface UseBotGameOptions {
  playerColor?: Color;
  depth?: number;
}

const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function useBotGame(options: UseBotGameOptions = {}) {
  const [chess] = useState(() => new Chess(initialFen));
  const [playerColor, setPlayerColor] = useState<Color>(options.playerColor ?? "w");
  const [status, setStatus] = useState<GameStatus>("in_progress");
  const [winner, setWinner] = useState<Color | null>(null);
  const [version, setVersion] = useState(0);
  const searchDepth = options.depth ?? 3;

  const game: Game = useMemo(
    () => ({
      id: "bot-local",
      fen: chess.fen(),
      pgn: chess.pgn(),
      players: { w: "You", b: "Bot (AI)" },
      status,
      turn: chess.turn(),
      winner,
      mode: "bot",
    }),
    [chess, status, winner, version]
  );

  const refreshStatus = useCallback(() => {
    let nextStatus: GameStatus = "in_progress";
    let gameWinner: Color | null = null;

    if (chess.isCheckmate()) {
      nextStatus = "checkmate";
      gameWinner = chess.turn() === "w" ? "b" : "w";
    } else if (chess.isStalemate()) {
      nextStatus = "stalemate";
    } else if (chess.isDraw()) {
      nextStatus = "draw";
    }

    setStatus(nextStatus);
    setWinner(gameWinner);
    setVersion((v) => v + 1);
  }, [chess]);

  const resetGame = useCallback(
    (color: Color = playerColor) => {
      chess.reset();
      setPlayerColor(color);
      setStatus("in_progress");
      setWinner(null);
      setVersion((v) => v + 1);
    },
    [chess, playerColor]
  );

  const resign = useCallback(() => {
    const winningColor = playerColor === "w" ? "b" : "w";
    setStatus("resigned");
    setWinner(winningColor);
    setVersion((v) => v + 1);
  }, [playerColor]);

  const makePlayerMove = useCallback(
    (from: Square, to: Square) => {
      if (chess.turn() !== playerColor || status !== "in_progress") return;
      const move = chess.move({ from, to, promotion: "q" });
      if (!move) return;

      refreshStatus();
    },
    [chess, playerColor, refreshStatus, status]
  );

  const triggerBotMove = useCallback(() => {
    if (status !== "in_progress") return;
    const botColor: Color = playerColor === "w" ? "b" : "w";
    if (chess.turn() !== botColor) return;

    const bestMove = findBestMove(chess, botColor, searchDepth);
    if (bestMove) {
      chess.move(bestMove);
      refreshStatus();
    }
  }, [chess, playerColor, refreshStatus, searchDepth, status]);

  useEffect(() => {
    if (playerColor === "b") {
      triggerBotMove();
    }
  }, [playerColor, triggerBotMove]);

  useEffect(() => {
    if (status !== "in_progress") return;
    const botColor: Color = playerColor === "w" ? "b" : "w";
    if (chess.turn() === botColor) {
      const timeout = setTimeout(() => triggerBotMove(), 250);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [chess, playerColor, status, triggerBotMove, version]);

  return {
    game,
    chess,
    playerColor,
    setPlayerColor,
    status,
    winner,
    makePlayerMove,
    resign,
    resetGame,
  };
}
