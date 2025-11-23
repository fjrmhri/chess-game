"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Game } from "@/types";
import { Loader2, Swords } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateGame = async () => {
    setIsCreating(true);
    try {
      const newGame: Omit<Game, "id"> = {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        pgn: "",
        players: { w: null, b: null },
        status: "waiting",
        turn: "w",
        createdAt: serverTimestamp(),
        chat: [],
      };
      const gameCollection = collection(db, "games");
      const docRef = await addDoc(gameCollection, newGame);
      router.push(`/game/${docRef.id}`);
    } catch (error) {
      console.error("Error creating game:", error);
      setIsCreating(false);
    }
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim()) {
      setIsJoining(true);
      router.push(`/game/${joinCode.trim()}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
      <Card className="w-full max-w-md z-10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Swords className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Firebase Chess Royale</CardTitle>
          </div>
          <CardDescription>Create a new match or join an existing one.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Button
              onClick={handleCreateGame}
              disabled={isCreating || isJoining}
              className="w-full text-lg py-6"
              size="lg"
            >
              {isCreating ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create New Game"
              )}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or Join a Game
                </span>
              </div>
            </div>
            <form onSubmit={handleJoinGame} className="space-y-4">
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter Game ID"
                className="text-center text-base"
                disabled={isCreating || isJoining}
              />
              <Button type="submit" variant="secondary" className="w-full" disabled={isCreating || isJoining || !joinCode.trim()}>
                 {isJoining ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Join Game"
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
