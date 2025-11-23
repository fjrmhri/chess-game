"use client";

import { Piece as PieceType } from "chess.js";
import {
  WhiteKing, WhiteQueen, WhiteRook, WhiteBishop, WhiteKnight, WhitePawn,
  BlackKing, BlackQueen, BlackRook, BlackBishop, BlackKnight, BlackPawn
} from "./ChessPieces";

interface PieceProps {
  piece: PieceType;
}

const pieceMap = {
  w: {
    k: WhiteKing,
    q: WhiteQueen,
    r: WhiteRook,
    b: WhiteBishop,
    n: WhiteKnight,
    p: WhitePawn,
  },
  b: {
    k: BlackKing,
    q: BlackQueen,
    r: BlackRook,
    b: BlackBishop,
    n: BlackKnight,
    p: BlackPawn,
  },
};

export function Piece({ piece }: PieceProps) {
  const PieceComponent = pieceMap[piece.color][piece.type];

  if (!PieceComponent) return null;

  return (
    <div className="relative w-full h-full p-1 cursor-pointer">
      <PieceComponent />
    </div>
  );
}
