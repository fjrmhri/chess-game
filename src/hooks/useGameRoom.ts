"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  User,
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import { Chess } from "chess.js";
import type { Color, Square } from "chess.js";

import { app } from "@/lib/firebase";
import { ChatMessage, Game, GameStatus } from "@/types";

import { useToast } from "./use-toast";

const db = getFirestore(app);
const auth = getAuth(app);

export function useGameRoom(gameId: string) {
  const [game, setGame] = useState<Game | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const chess = useMemo(() => (game ? new Chess(game.fen) : null), [game]);

  const playerColor: Color | null = useMemo(() => {
    if (!game || !user) return null;
    if (game.players.w === user.uid) return "w";
    if (game.players.b === user.uid) return "b";
    return null;
  }, [game, user]);

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch(() => {
          setError("Failed to sign in. Please refresh the page.");
        });
      }
    });
    return () => authUnsubscribe();
  }, []);

  useEffect(() => {
    if (!gameId) {
      setError("Game ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    const gameRef = doc(db, "games", gameId);

    setLoading(true);
    const gameUnsubscribe = onSnapshot(
      gameRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const rawData = docSnap.data();
          const gameData = {
            id: docSnap.id,
            winner: null,
            ...rawData,
            mode: (rawData.mode as Game["mode"]) ?? "multiplayer",
            presence:
              rawData.presence ??
              ({
                w: { online: false, lastActive: null },
                b: { online: false, lastActive: null },
              } as Game["presence"]),
            inviteCode: rawData.inviteCode ?? "",
          } as Game;

          setGame(gameData);
          setError(null);

          if (!user) {
            setLoading(false);
            return;
          }

          if (
            user.uid !== gameData.players.w &&
            user.uid !== gameData.players.b
          ) {
            if (gameData.players.w === null) {
              updateDoc(gameRef, {
                "players.w": user.uid,
                mode: gameData.mode ?? "multiplayer",
                presence: {
                  ...(gameData.presence ?? {}),
                  w: { online: true, lastActive: serverTimestamp() },
                  b: gameData.presence?.b ?? {
                    online: false,
                    lastActive: null,
                  },
                },
              }).catch(() => {
                toast({
                  title: "Unable to join",
                  description: "Failed to reserve the white seat.",
                  variant: "destructive",
                });
              });
            } else if (gameData.players.b === null) {
              updateDoc(gameRef, {
                "players.b": user.uid,
                status: "in_progress",
                mode: gameData.mode ?? "multiplayer",
                presence: {
                  ...(gameData.presence ?? {}),
                  b: { online: true, lastActive: serverTimestamp() },
                  w: gameData.presence?.w ?? {
                    online: false,
                    lastActive: null,
                  },
                },
              }).catch(() => {
                toast({
                  title: "Unable to join",
                  description: "Failed to reserve the black seat.",
                  variant: "destructive",
                });
              });
            }
          }
        } else {
          setError("Game not found.");
        }
        setLoading(false);
      },
      () => {
        setError("Failed to load game data.");
        setLoading(false);
      }
    );

    return () => {
      gameUnsubscribe();
    };
  }, [gameId, toast, user]);

  useEffect(() => {
    if (!gameId) return;

    const chatQuery = query(
      collection(db, `games/${gameId}/chat`),
      orderBy("timestamp", "asc")
    );

    const chatUnsubscribe = onSnapshot(
      chatQuery,
      (querySnapshot) => {
        const messages = querySnapshot.docs
          .map((chatDoc) => ({ id: chatDoc.id, ...chatDoc.data() } as ChatMessage))
          .sort((a, b) => {
            const aTime = a.timestamp?.toMillis?.() ?? 0;
            const bTime = b.timestamp?.toMillis?.() ?? 0;
            return aTime - bTime;
          });

        const uniqueMessages = Array.from(
          new Map(messages.map((msg) => [msg.id, msg])).values()
        );

        setChatMessages(uniqueMessages);
      },
      () => {
        toast({
          title: "Chat Error",
          description: "Tidak dapat memuat pesan obrolan.",
          variant: "destructive",
        });
      }
    );

    return () => chatUnsubscribe();
  }, [gameId, toast]);

  const makeMove = useCallback(
    async (from: Square, to: Square) => {
      if (!chess || !game || !playerColor || chess.turn() !== playerColor)
        return;

      try {
        const move = chess.move({ from, to, promotion: "q" });
        if (move === null) {
          toast({
            title: "Invalid Move",
            description: "That move is not allowed.",
            variant: "destructive",
          });
          return;
        }

        let newStatus: GameStatus = "in_progress";
        let winner: Color | null = null;
        if (chess.isCheckmate()) {
          newStatus = "checkmate";
          winner = chess.turn() === "w" ? "b" : "w";
        } else if (chess.isStalemate()) newStatus = "stalemate";
        else if (chess.isDraw()) newStatus = "draw";

        await updateDoc(doc(db, "games", gameId), {
          fen: chess.fen(),
          pgn: chess.pgn(),
          turn: chess.turn(),
          status: newStatus,
          winner,
          lastMoveAt: serverTimestamp(),
          presence: playerColor
            ? {
                ...(game.presence ?? {}),
                [playerColor]: { online: true, lastActive: serverTimestamp() },
              }
            : game.presence,
        });
      } catch (e) {
        chess.undo();
        setGame(game);
        toast({
          title: "Move Failed",
          description: "Could not sync your move. Please try again.",
          variant: "destructive",
        });
      }
    },
    [chess, game, playerColor, gameId, toast]
  );

  const resign = useCallback(async () => {
    if (!playerColor) return;
    await updateDoc(doc(db, "games", gameId), {
      status: "resigned",
      winner: playerColor === "w" ? "b" : "w",
      lastMoveAt: serverTimestamp(),
    });
  }, [gameId, playerColor, toast]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!user || !playerColor) return;
      try {
        await addDoc(collection(db, `games/${gameId}/chat`), {
          text,
          sender: playerColor,
          uid: user.uid,
          timestamp: serverTimestamp(),
        });
      } catch (e) {
        toast({
          title: "Chat Error",
          description: "Could not send your message.",
          variant: "destructive",
        });
      }
    },
    [user, playerColor, gameId, toast]
  );

  const updatePresence = useCallback(
    async (online: boolean) => {
      if (!playerColor) return;
      try {
        await updateDoc(doc(db, "games", gameId), {
          presence: {
            ...(game?.presence ?? {}),
            [playerColor]: { online, lastActive: serverTimestamp() },
          },
        });
      } catch (err) {
        toast({
          title: "Connection issue",
          description: "Presence could not be updated.",
          variant: "destructive",
        });
      }
    },
    [game?.presence, gameId, playerColor, toast]
  );

  useEffect(() => {
    if (!playerColor) return;

    updatePresence(true);

    const handleVisibilityChange = () => {
      updatePresence(document.visibilityState === "visible");
    };

    const handleBeforeUnload = () => {
      updatePresence(false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      updatePresence(false);
    };
  }, [playerColor, updatePresence]);

  return {
    game,
    chess,
    playerColor,
    loading,
    error,
    makeMove,
    sendMessage,
    resign,
    chatMessages,
  };
}
