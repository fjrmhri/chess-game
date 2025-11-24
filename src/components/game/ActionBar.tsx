"use client";

import { Color } from "chess.js";
import { Flag, RotateCcw, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ActionBarProps {
  canMove: boolean;
  onResign?: () => void;
  onReset?: () => void;
  modeLabel: string;
  playerColor: Color | null;
  turn: Color;
  status: string;
}

export function ActionBar({
  canMove,
  onResign,
  onReset,
  modeLabel,
  playerColor,
  turn,
  status,
}: ActionBarProps) {
  const isYourTurn = playerColor && playerColor === turn;

  // Panel tindakan menjaga aksi utama tetap mudah dijangkau dan transparan status giliran
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{modeLabel}</span>
          <span className="text-sm text-muted-foreground capitalize">{status.replace("_", " ")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="rounded-md bg-muted/60 px-3 py-2 text-sm">
          {playerColor ? (
            <div className="flex items-center justify-between">
              <span className="font-medium">{isYourTurn ? "Your turn" : "Opponent turn"}</span>
              <span className="text-muted-foreground">{playerColor === "w" ? "White" : "Black"}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Assigning seat...</span>
          )}
        </div>
        <Separator />
        <div className="flex gap-2">
          <Button variant="destructive" className="flex-1" disabled={!canMove} onClick={onResign}>
            <Flag className="h-4 w-4 mr-2" /> Resign
          </Button>
          {onReset ? (
            <Button variant="outline" className="flex-1" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" /> Restart
            </Button>
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>All moves are validated locally then synced for fairness.</span>
        </div>
      </CardContent>
    </Card>
  );
}
