"use client";

import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GameStatus } from "@/types";
import { Color } from "chess.js";

interface GameOverDialogProps {
  status: GameStatus;
  playerColor: Color | null;
  winner: Color | null;
}

export function GameOverDialog({ status, playerColor, winner }: GameOverDialogProps) {
  const router = useRouter();
  const isOpen =
    status === "checkmate" || status === "stalemate" || status === "draw" || status === "resigned";

  let title = "Game Over";
  let description = "";

  if (status === "checkmate") {
    title = "Checkmate!";
    const didYouWin = (playerColor === "w" && winner === "w") || (playerColor === "b" && winner === "b");
    const winnerLabel = winner === "w" ? "White" : "Black";
    description = `${winnerLabel} wins by checkmate. ${didYouWin ? "Congratulations!" : "Better luck next time."}`;
  } else if (status === "stalemate") {
    title = "Stalemate";
    description = "The game is a draw by stalemate.";
  } else if (status === "draw") {
    title = "Draw";
    description = "The game has ended in a draw.";
  } else if (status === "resigned") {
    title = "Resignation";
    const winnerLabel = winner === "w" ? "White" : "Black";
    description = `${winnerLabel} wins by resignation.`;
  }

  // Mengarahkan pemain kembali ke lobby setelah dialog ditutup
  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
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
