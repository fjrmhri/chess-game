import { Timestamp } from "firebase/firestore";
import { Color } from "chess.js";

export type GameMode = "multiplayer" | "bot";
export type GameStatus =
  | "waiting"
  | "in_progress"
  | "checkmate"
  | "stalemate"
  | "draw"
  | "resigned";

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
  winner: Color | null;
  mode: GameMode;
  createdAt?: Timestamp;
  chat?: ChatMessage[];
  presence?: PresenceState;
  lastMoveAt?: Timestamp | null;
  inviteCode: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: Color;
  uid: string;
  timestamp: Timestamp;
}

export interface PresenceState {
  w: PresenceSnapshot;
  b: PresenceSnapshot;
}

export interface PresenceSnapshot {
  online: boolean;
  lastActive: Timestamp | null;
}
