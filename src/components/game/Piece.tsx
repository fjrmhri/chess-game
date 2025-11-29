"use client";

import Image from "next/image";
import { Piece as PieceType } from "chess.js";

import BBishop from "../../../assets/black/B_Bishop.png";
import BKing from "../../../assets/black/B_King.png";
import BKnight from "../../../assets/black/B_Knight.png";
import BPawn from "../../../assets/black/B_Pawn.png";
import BQueen from "../../../assets/black/B_Queen.png";
import BRook from "../../../assets/black/B_Rook.png";
import WBishop from "../../../assets/white/W_Bishop.png";
import WKing from "../../../assets/white/W_King.png";
import WKnight from "../../../assets/white/W_Knight.png";
import WPawn from "../../../assets/white/W_Pawn.png";
import WQueen from "../../../assets/white/W_Queen.png";
import WRook from "../../../assets/white/W_Rook.png";

interface PieceProps {
  piece: PieceType;
}

const pieceMap: Record<PieceType["color"], Record<PieceType["type"], string>> = {
  w: {
    k: WKing.src,
    q: WQueen.src,
    r: WRook.src,
    b: WBishop.src,
    n: WKnight.src,
    p: WPawn.src,
  },
  b: {
    k: BKing.src,
    q: BQueen.src,
    r: BRook.src,
    b: BBishop.src,
    n: BKnight.src,
    p: BPawn.src,
  },
};

const pieceNames: Record<PieceType["type"], string> = {
  k: "King",
  q: "Queen",
  r: "Rook",
  b: "Bishop",
  n: "Knight",
  p: "Pawn",
};

export function Piece({ piece }: PieceProps) {
  const pieceSrc = pieceMap[piece.color][piece.type];
  const colorName = piece.color === "w" ? "White" : "Black";
  const pieceName = pieceNames[piece.type];

  if (!pieceSrc) return null;

  return (
    <div className="relative h-full w-full cursor-pointer p-1">
      <Image src={pieceSrc} alt={`${colorName} ${pieceName}`} fill className="object-contain" />
    </div>
  );
}
