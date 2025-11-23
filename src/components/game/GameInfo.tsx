"use client";

import { Game } from "@/types";
import { Chess, Color } from "chess.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, User, Users, Hourglass } from "lucide-react";

interface GameInfoProps {
  game: Game;
  chess: Chess;
  playerColor: Color | null;
}

const PlayerInfo = ({ title, id, isYou }: { title: string, id: string | null, isYou: boolean }) => (
    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg text-center">
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground truncate w-full" title={id ?? '...'}>{id ?? 'Waiting...'}</p>
        {isYou && <div className="text-xs font-bold text-primary mt-1">(You)</div>}
    </div>
);


export function GameInfo({ game, chess, playerColor }: GameInfoProps) {
  const { status, players } = game;
  const turn = chess.turn();

  const getStatusText = () => {
    switch (status) {
      case "waiting":
        return "Waiting for opponent...";
      case "checkmate":
        return `Checkmate! ${turn === "w" ? "Black" : "White"} wins.`;
      case "stalemate":
        return "Stalemate. Draw.";
      case "draw":
        return "Draw.";
      case "in_progress":
        if (chess.inCheck()) {
            return `${turn === "w" ? "White" : "Black"} is in Check!`;
        }
        return `${turn === "w" ? "White's" : "Black's"} turn`;
      default:
        return "Game in progress";
    }
  };

  const statusColor = chess.inCheck() ? 'text-accent' : 'text-foreground';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          {status === 'in_progress' ? <Hourglass className="w-5 h-5"/> : <Crown className="w-5 h-5"/>}
           Game Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`text-center font-bold text-lg p-3 rounded-lg bg-card ${statusColor}`}>{getStatusText()}</div>

        <div className="grid grid-cols-2 gap-4">
           <PlayerInfo title="White" id={players.w} isYou={playerColor === 'w'}/>
           <PlayerInfo title="Black" id={players.b} isYou={playerColor === 'b'}/>
        </div>
      </CardContent>
    </Card>
  );
}
