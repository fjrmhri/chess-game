"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { Timestamp, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Loader2, Swords } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { Game } from "@/types";

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleCreateGame = async () => {
    setIsCreating(true);
    setActionError(null);

    // Menyiapkan state awal permainan baru sehingga halaman game punya data default
    try {
      const newGame: Omit<Game, "id"> = {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        pgn: "",
        players: { w: null, b: null },
        status: "waiting",
        turn: "w",
        createdAt: serverTimestamp() as unknown as Timestamp,
        winner: null,
        mode: "multiplayer",
        presence: {
          w: { online: false, lastActive: null },
          b: { online: false, lastActive: null },
        },
        lastMoveAt: null,
      };
      const gameCollection = collection(db, "games");
      const docRef = await addDoc(gameCollection, newGame);
      router.push(`/game/${docRef.id}`);
    } catch (error) {
      console.error("Error creating game:", error);
      setActionError("Gagal membuat permainan baru. Silakan coba lagi.");
    } finally {
      // Tetap menghentikan loading jika navigasi tidak langsung terjadi
      setIsCreating(false);
    }
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();

    if (!joinCode.trim()) {
      setActionError("Kode permainan tidak boleh kosong.");
      return;
    }

    try {
      setIsJoining(true);
      router.push(`/game/${joinCode.trim()}`);
    } catch (error) {
      console.error("Error joining game:", error);
      setActionError("Tidak dapat bergabung ke permainan. Pastikan kode benar.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
      <Card className="w-full max-w-3xl z-10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Swords className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Firebase Chess Royale</CardTitle>
          </div>
          <CardDescription>Create a new match or join an existing one.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <Button
              onClick={handleCreateGame}
              disabled={isCreating || isJoining}
              className="w-full text-lg py-6"
              size="lg"
            >
              {isCreating ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Multiplayer: Create Room"
              )}
            </Button>
            <div className="space-y-4">
              <form onSubmit={handleJoinGame} className="space-y-4">
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter Game ID"
                  className="text-center text-base"
                  disabled={isCreating || isJoining}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full"
                  disabled={isCreating || isJoining || !joinCode.trim()}
                >
                  {isJoining ? <Loader2 className="animate-spin" /> : "Join Multiplayer Game"}
                </Button>
              </form>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <span>or</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="rounded-lg border p-4 bg-muted/40 space-y-3">
                <div className="font-semibold">Solo Practice</div>
                <p className="text-sm text-muted-foreground">
                  Want to test lines quickly? Play against the built-in bot locally with the same board controls.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/bot">Play vs Bot</Link>
                </Button>
              </div>
            </div>
            {actionError ? (
              <p className="text-sm text-destructive text-center" role="alert">
                {actionError}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
