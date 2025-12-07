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
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <Card className="overflow-hidden border-border/60 shadow-xl">
          <div className="flex flex-col gap-3 border-b bg-gradient-to-r from-primary/15 via-background to-accent/15 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Swords className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Chess Game</p>
                <CardTitle className="text-2xl font-headline text-foreground">Jump back into the action</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Host a room, join friends, or practice against our upgraded bot.
                </CardDescription>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-3 rounded-lg border bg-muted/40 p-5 shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Multiplayer</p>
                  <p className="text-lg font-semibold text-foreground">Play with friends</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Live</span>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handleCreateGame}
                  disabled={isCreating || isJoining}
                  className="w-full justify-between rounded-lg bg-primary px-4 py-5 text-base font-semibold shadow-sm hover:bg-primary/90"
                  size="lg"
                >
                  <div className="flex items-center gap-2">
                    <Swords className="h-5 w-5" />
                    <span>Start Multiplayer Room</span>
                  </div>
                  {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="text-sm">Ready</span>}
                </Button>

                <form onSubmit={handleJoinGame} className="grid gap-3 rounded-lg border bg-card/60 p-4 shadow-inner md:grid-cols-[1.1fr_auto]">
                  <Input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter invite code"
                    className="h-11 rounded-md border-muted-foreground/30 text-base"
                    disabled={isCreating || isJoining}
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="h-11 rounded-md px-5 text-base font-semibold"
                    disabled={isCreating || isJoining || !joinCode.trim()}
                  >
                    {isJoining ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join game"}
                  </Button>
                  {actionError ? (
                    <p className="md:col-span-2 text-sm text-destructive" role="alert">
                      {actionError}
                    </p>
                  ) : null}
                </form>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border bg-muted/40 p-5 shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Practice mode</p>
                  <p className="text-lg font-semibold text-foreground">Play against the bot</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Upgraded</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Train openings, explore ideas, and get instant feedback with the same polished board used in multiplayer.
              </p>
              <Button asChild variant="outline" className="w-full rounded-md border-primary/30 text-base font-semibold hover:bg-primary/10">
                <Link href="/bot">Practice vs Bot</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
