"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { GameStatus } from "@/types";
import { Color } from "chess.js";

interface GameOverDialogProps {
  status: GameStatus;
  playerColor: Color | null;
  winner: "White" | "Black";
}

export function GameOverDialog({ status, playerColor, winner }: GameOverDialogProps) {
  const router = useRouter();
  const isOpen = status === "checkmate" || status === "stalemate" || status === "draw";

  let title = "Game Over";
  let description = "";

  if (status === "checkmate") {
    title = "Checkmate!";
    const didYouWin = (playerColor === 'w' && winner === 'White') || (playerColor === 'b' && winner === 'Black');
    description = `${winner} wins by checkmate. ${didYouWin ? "Congratulations!" : "Better luck next time."}`;
  } else if (status === "stalemate") {
    title = "Stalemate";
    description = "The game is a draw by stalemate.";
  } else if (status === "draw") {
    title = "Draw";
    description = "The game has ended in a draw.";
  }

  const handleGoHome = () => {
    router.push('/');
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleGoHome}>
            Return to Lobby
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
