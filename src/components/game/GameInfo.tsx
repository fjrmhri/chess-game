"use client";

import { Game, PresenceSnapshot } from "@/types";
import { Chess, Color } from "chess.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Hourglass, Wifi } from "lucide-react";

interface GameInfoProps {
  game: Game;
  chess: Chess;
  playerColor: Color | null;
}

const PlayerInfo = ({
  title,
  id,
  isYou,
  presence,
}: {
  title: string;
  id: string | null;
  isYou: boolean;
  presence?: PresenceSnapshot;
}) => (
  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg text-center">
    <h4 className="font-bold text-sm">{title}</h4>
    <p className="text-xs text-muted-foreground truncate w-full" title={id ?? "..."}>
      {id ?? "Waiting..."}
    </p>
    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
      <Wifi className={`h-3 w-3 ${presence?.online ? "text-primary" : "text-muted-foreground"}`} />
      <span>{presence?.online ? "Online" : "Offline"}</span>
    </div>
    {isYou && <div className="text-xs font-bold text-primary mt-1">(You)</div>}
  </div>
);


export function GameInfo({ game, chess, playerColor }: GameInfoProps) {
  const { status, players, winner, mode, presence } = game;
  const turn = chess.turn();

  const getStatusText = () => {
    switch (status) {
      case "waiting":
        return "Waiting for opponent...";
      case "checkmate":
        return `Checkmate! ${winner === "w" ? "White" : "Black"} wins.`;
      case "stalemate":
        return "Stalemate. Draw.";
      case "draw":
        return "Draw.";
      case "resigned":
        return `${winner === "w" ? "White" : "Black"} wins by resignation.`;
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
          {status === "in_progress" ? <Hourglass className="w-5 h-5" /> : <Crown className="w-5 h-5" />}
          Game Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`text-center font-bold text-lg p-3 rounded-lg bg-card ${statusColor}`}>
          {getStatusText()}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <PlayerInfo
            title="White"
            id={players.w}
            isYou={playerColor === "w"}
            presence={presence?.w}
          />
          <PlayerInfo
            title="Black"
            id={players.b}
            isYou={playerColor === "b"}
            presence={presence?.b}
          />
        </div>

        <div className="rounded-md border bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          Mode: {mode === "bot" ? "Play vs Bot" : "Multiplayer"}
        </div>
      </CardContent>
    </Card>
  );
}
