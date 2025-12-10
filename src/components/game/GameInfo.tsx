"use client";

import { useState } from "react";

import { Chess, Color } from "chess.js";
import { Crown, Hourglass, Wifi } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Game, PresenceSnapshot } from "@/types";
import { useToast } from "@/hooks/use-toast";

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
    <p
      className="w-full truncate text-xs text-muted-foreground"
      title={id ?? "..."}
    >
      {id ?? "Waiting..."}
    </p>
    <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
      <Wifi
        className={`h-3 w-3 ${
          presence?.online ? "text-primary" : "text-muted-foreground"
        }`}
      />
      <span>{presence?.online ? "Online" : "Offline"}</span>
    </div>
    {isYou ? (
      <div className="mt-1 text-xs font-bold text-primary">(You)</div>
    ) : null}
  </div>
);

export function GameInfo({ game, chess, playerColor }: GameInfoProps) {
  const { status, players, winner, mode, presence } = game;
  const turn = chess.turn();
  const inCheck = chess.inCheck();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyInvite = async () => {
    if (!game.inviteCode) return;
    await navigator.clipboard.writeText(game.inviteCode);
    setCopied(true);
    toast({
      title: "Invite code copied",
      description: "Bagikan kode ini kepada teman Anda.",
    });
    setTimeout(() => setCopied(false), 1500);
  };

  const statusText = (() => {
    switch (status) {
      case "waiting":
        return "Menunggu lawan...";
      case "checkmate":
        return `Checkmate! ${winner === "w" ? "White" : "Black"} wins.`;
      case "stalemate":
        return "Stalemate. Draw.";
      case "draw":
        return "Draw.";
      case "resigned":
        return `${winner === "w" ? "White" : "Black"} wins by resignation.`;
      case "in_progress":
        if (inCheck) {
          return `${turn === "w" ? "White" : "Black"} is in Check!`;
        }
        return `${turn === "w" ? "White's" : "Black's"} turn`;
      default:
        return "Game in progress";
    }
  })();

  const statusColor = inCheck ? "text-accent" : "text-foreground";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          {status === "in_progress" ? (
            <Hourglass className="h-5 w-5" />
          ) : (
            <Crown className="h-5 w-5" />
          )}
          Game Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`rounded-lg bg-card p-3 text-center text-lg font-bold ${statusColor}`}
        >
          {statusText}
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

        {game.inviteCode ? (
          <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-muted-foreground">
                Invite Code
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyInvite}
                disabled={copied}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="font-mono text-lg tracking-widest">{game.inviteCode}</div>
          </div>
        ) : null}

        <div className="rounded-md border bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          Mode: {mode === "bot" ? "Play vs Bot" : "Multiplayer"}
        </div>
      </CardContent>
    </Card>
  );
}
