"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useGameRoom } from "@/hooks/useGameRoom";
import { Board } from "@/components/game/Board";
import { Chat } from "@/components/game/Chat";
import { GameInfo } from "@/components/game/GameInfo";
import { GameOverDialog } from "@/components/game/GameOverDialog";
import { Suggestion } from "@/components/game/Suggestion";
import { ActionBar } from "@/components/game/ActionBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Swords, Info } from "lucide-react";

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const {
    game,
    chess,
    playerColor,
    loading,
    error,
    makeMove,
    sendMessage,
    resign,
    chatMessages,
  } = useGameRoom(gameId);

  if (loading) {
    return <GameLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!game || !chess) {
    return null; // Should be handled by error state
  }

  const isPlayerTurn = chess.turn() === playerColor;
  const isGameOver = chess.isGameOver() || game.status === "resigned";

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Swords className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Multiplayer Match</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Switch mode:</span>
              <Link href="/bot" className="underline underline-offset-4">Play vs Bot</Link>
            </div>
          </CardHeader>
        </Card>

        <main className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4">
          <Card className="lg:row-span-2">
            <CardContent className="p-3 sm:p-4 md:p-6 flex justify-center">
              <Board
                chess={chess}
                onMove={makeMove}
                playerColor={playerColor}
                isPlayerTurn={isPlayerTurn}
                isGameOver={isGameOver}
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <GameInfo game={game} chess={chess} playerColor={playerColor} />
            <ActionBar
              canMove={!isGameOver}
              onResign={resign}
              modeLabel="Multiplayer"
              playerColor={playerColor}
              turn={chess.turn()}
              status={game.status}
            />
            <Suggestion fen={chess.fen()} pgn={chess.pgn()} disabled={!isPlayerTurn || isGameOver} />
          </div>

          <Chat playerColor={playerColor} messages={chatMessages} onSendMessage={sendMessage} />
        </main>
      </div>
      <GameOverDialog status={game.status} playerColor={playerColor} winner={game.winner} />
    </div>
  );
}

function GameLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <main className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4 max-w-6xl mx-auto">
        <Card className="lg:row-span-2">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="aspect-square w-full">
              <Skeleton className="w-full h-full" />
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </main>
    </div>
  );
}
