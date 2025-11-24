"use client";

import { useMemo } from "react";

import { Chess, Color } from "chess.js";
import { Crown, Hourglass, Wifi } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Game, PresenceSnapshot } from "@/types";

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
  <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3 text-center">
    <h4 className="text-sm font-bold">{title}</h4>
    <p className="w-full truncate text-xs text-muted-foreground" title={id ?? "..."}>
      {id ?? "Waiting..."}
    </p>
    <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
      <Wifi className={`h-3 w-3 ${presence?.online ? "text-primary" : "text-muted-foreground"}`} />
      <span>{presence?.online ? "Online" : "Offline"}</span>
    </div>
    {isYou ? <div className="mt-1 text-xs font-bold text-primary">(You)</div> : null}
  </div>
);

export function GameInfo({ game, chess, playerColor }: GameInfoProps) {
  const { status, players, winner, mode, presence } = game;

  // Menghindari hitung ulang teks status yang mahal ketika tidak ada perubahan terkait
  const statusText = useMemo(() => {
    const turn = chess.turn();
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
  }, [chess, status, winner]);

  const statusColor = useMemo(() => (chess.inCheck() ? "text-accent" : "text-foreground"), [chess]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          {status === "in_progress" ? <Hourglass className="h-5 w-5" /> : <Crown className="h-5 w-5" />}
          Game Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`rounded-lg bg-card p-3 text-center text-lg font-bold ${statusColor}`}>{statusText}</div>

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
