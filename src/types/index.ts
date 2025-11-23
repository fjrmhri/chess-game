import { Timestamp } from "firebase/firestore";
import { Color } from "chess.js";

export type GameStatus = "waiting" | "in_progress" | "checkmate" | "stalemate" | "draw";

export interface Player {
  id: string;
  name?: string;
}

export interface Game {
  id: string;
  fen: string;
  pgn: string;
  players: {
    w: string | null;
    b: string | null;
  };
  status: GameStatus;
  turn: "w" | "b";
  createdAt: Timestamp;
  chat: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: Color;
  uid: string;
  timestamp: Timestamp;
}
