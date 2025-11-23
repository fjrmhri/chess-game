"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Color } from "chess.js";

import { ActionBar } from "@/components/game/ActionBar";
import { Board } from "@/components/game/Board";
import { GameInfo } from "@/components/game/GameInfo";
import { GameOverDialog } from "@/components/game/GameOverDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBotGame } from "@/hooks/useBotGame";

export default function BotPage() {
  const [preferredColor, setPreferredColor] = useState<Color>("w");
  const { game, chess, playerColor, setPlayerColor, makePlayerMove, resign, resetGame } = useBotGame({
    playerColor: preferredColor,
  });

  const isPlayerTurn = chess.turn() === playerColor;
  const isGameOver = useMemo(() => game.status !== "in_progress", [game.status]);

  const handleColorSwitch = (color: Color) => {
    setPreferredColor(color);
    setPlayerColor(color);
    resetGame(color);
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground">Local Practice</p>
            <h1 className="text-2xl font-bold">Play vs Bot</h1>
          </div>
          <Button asChild variant="ghost">
            <Link href="/">Back to lobby</Link>
          </Button>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
          <Card className="lg:row-span-2">
            <CardContent className="p-3 sm:p-4 md:p-6 flex justify-center">
              <Board
                chess={chess}
                onMove={makePlayerMove}
                playerColor={playerColor}
                isPlayerTurn={isPlayerTurn && !isGameOver}
                isGameOver={isGameOver}
              />
            </CardContent>
          </Card>

          <GameInfo game={game} chess={chess} playerColor={playerColor} />

          <div className="space-y-4">
            <ActionBar
              canMove={!isGameOver}
              onResign={resign}
              onReset={() => resetGame(playerColor)}
              modeLabel="Bot match"
              playerColor={playerColor}
              turn={chess.turn()}
              status={game.status}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choose your color</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  variant={preferredColor === "w" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleColorSwitch("w")}
                >
                  Play White
                </Button>
                <Button
                  variant={preferredColor === "b" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleColorSwitch("b")}
                >
                  Play Black
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <GameOverDialog status={game.status} playerColor={playerColor} winner={game.winner} />
    </div>
  );
}
