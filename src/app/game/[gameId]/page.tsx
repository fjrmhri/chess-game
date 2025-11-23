"use client";

import { useParams } from "next/navigation";
import { useGameRoom } from "@/hooks/useGameRoom";
import { Board } from "@/components/game/Board";
import { Chat } from "@/components/game/Chat";
import { GameInfo } from "@/components/game/GameInfo";
import { GameOverDialog } from "@/components/game/GameOverDialog";
import { Suggestion } from "@/components/game/Suggestion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
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
  const isGameOver = chess.isGameOver();

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <main className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <div className="lg:col-span-2 xl:col-span-3">
          <Card>
            <CardContent className="p-2 sm:p-4 md:p-6">
              <Board
                chess={chess}
                onMove={makeMove}
                playerColor={playerColor}
                isPlayerTurn={isPlayerTurn}
                isGameOver={isGameOver}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
          <GameInfo game={game} chess={chess} playerColor={playerColor} />
          <Chat
            gameId={gameId}
            playerColor={playerColor}
            messages={chatMessages}
            onSendMessage={sendMessage}
          />
          <Suggestion fen={chess.fen()} pgn={chess.pgn()} disabled={!isPlayerTurn || isGameOver} />
        </div>
      </main>
      <GameOverDialog
        status={game.status}
        playerColor={playerColor}
        winner={chess.turn() === "w" ? "Black" : "White"}
      />
    </div>
  );
}

function GameLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <main className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <div className="lg:col-span-2 xl:col-span-3">
          <Card>
            <CardContent className="p-2 sm:p-4 md:p-6">
              <div className="aspect-square w-full">
                <Skeleton className="w-full h-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </main>
    </div>
  );
}
