"use client";

import { Piece as PieceType } from "chess.js";
import {
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
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
  // Memetakan tipe bidak ke komponen SVG agar Board bisa merender secara deklaratif
  const PieceComponent = pieceMap[piece.color][piece.type];

  if (!PieceComponent) return null;

  return (
    <div className="relative h-full w-full cursor-pointer p-1">
      <PieceComponent />
    </div>
  );
}
