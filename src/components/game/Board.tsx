"use client";

import { useState } from "react";
import type { Chess } from "chess.js";
import type { Color, Piece, Square as ChessSquare } from "chess.js";
import { Square } from "./Square";

interface BoardProps {
  chess: Chess;
  onMove: (from: ChessSquare, to: ChessSquare) => void;
  playerColor: Color | null;
  isPlayerTurn: boolean;
  isGameOver: boolean;
}

export function Board({ chess, onMove, playerColor, isPlayerTurn, isGameOver }: BoardProps) {
  const [selectedPiece, setSelectedPiece] = useState<ChessSquare | null>(null);

  const board = chess.board();
  const boardOrientation =
    playerColor === "b"
      ? board
          .slice()
          .reverse()
          .map((row) => row.slice().reverse())
      : board;

  const handleSquareClick = (square: ChessSquare) => {
    if (isGameOver || !isPlayerTurn) return;

    // Menangani klik kotak agar pemilihan bidak lebih jelas untuk pemain
    if (selectedPiece) {
      const moves = chess.moves({ square: selectedPiece, verbose: true });
      const move = moves.find((m) => m.to === square);
      if (move) {
        onMove(selectedPiece, square);
        setSelectedPiece(null);
      } else {
        // Jika pemain menekan bidak sendiri yang lain, langsung ganti pilihan
        const piece = chess.get(square);
        if (piece && piece.color === playerColor) {
          setSelectedPiece(square);
        } else {
          setSelectedPiece(null);
        }
      }
    } else {
      const piece = chess.get(square);
      if (piece && piece.color === playerColor) {
        setSelectedPiece(square);
      }
    }
  };

  const getSquareFromIndex = (rowIndex: number, colIndex: number): ChessSquare => {
    if (playerColor === "b") {
      return `${String.fromCharCode(97 + 7 - colIndex)}${rowIndex + 1}` as ChessSquare;
    }

    return `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}` as ChessSquare;
  };
  
  const possibleMoves = selectedPiece
    ? chess.moves({ square: selectedPiece, verbose: true }).map((move) => move.to)
    : [];

  return (
    <div className="relative aspect-square w-full max-w-[640px] mx-auto select-none">
      {boardOrientation.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((piece, colIndex) => {
            const square = getSquareFromIndex(rowIndex, colIndex);
            return (
              <Square
                key={square}
                square={square}
                piece={piece}
                isSelected={selectedPiece === square}
                isPossibleMove={possibleMoves.includes(square)}
                inCheck={chess.inCheck() && piece?.type === "k" && piece?.color === chess.turn()}
                onClick={() => handleSquareClick(square)}
              />
            );
          })}
        </div>
      ))}
      {isGameOver && (
        <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
          <span className="text-4xl font-bold text-foreground font-headline">Game Over</span>
        </div>
      )}
    </div>
  );
}
