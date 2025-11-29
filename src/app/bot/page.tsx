"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Color } from "chess.js";

import { ActionBar } from "@/components/game/ActionBar";
import { Board } from "@/components/game/Board";
import { BoardSelector } from "@/components/game/BoardSelector";
import { GameInfo } from "@/components/game/GameInfo";
import { GameOverDialog } from "@/components/game/GameOverDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBoardPreference } from "@/hooks/useBoardPreference";
import { useBotGame } from "@/hooks/useBotGame";

export default function BotPage() {
  const [preferredColor, setPreferredColor] = useState<Color>("w");
  const { boardId, boardTexture, setBoardId } = useBoardPreference();
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
      <div className="mx-auto max-w-7xl space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">Local Practice</p>
              <CardTitle className="text-2xl">Play vs Bot</CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Back to lobby</Link>
            </Button>
          </CardHeader>
        </Card>

        <main className="grid grid-cols-1 items-start gap-4 xl:gap-6 lg:grid-cols-[280px_minmax(520px,1fr)_320px]">
          <div className="order-3 space-y-4 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Practice settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Choose your side and keep playing without reloading the page. Bot play mirrors the multiplayer layout for a
                  consistent feel.
                </p>
                <div className="flex gap-2">
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
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium text-foreground">Board style</p>
                    <span className="text-xs text-muted-foreground">Used in all modes</span>
                  </div>
                  <BoardSelector value={boardId} onChange={setBoardId} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="order-1 lg:order-2 lg:row-span-2">
            <CardContent className="flex flex-col gap-4 p-4 sm:p-5 lg:p-6">
              <Board
                chess={chess}
                onMove={makePlayerMove}
                playerColor={playerColor}
                isPlayerTurn={isPlayerTurn && !isGameOver}
                isGameOver={isGameOver}
                boardTexture={boardTexture}
              />
            </CardContent>
          </Card>

          <div className="order-2 space-y-4 lg:order-3">
            <GameInfo game={game} chess={chess} playerColor={playerColor} />
            <ActionBar
              canMove={!isGameOver}
              onResign={resign}
              onReset={() => resetGame(playerColor)}
              modeLabel="Bot match"
              playerColor={playerColor}
              turn={chess.turn()}
              status={game.status}
            />
          </div>
        </main>
      </div>

      <GameOverDialog status={game.status} playerColor={playerColor} winner={game.winner} />
    </div>
  );
}
