"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/firebase-auth";
import { Chess } from "chess.js";
import type { Square, Color } from "chess.js";
import { app } from "@/lib/firebase";
import { Game, GameStatus, ChatMessage } from "@/types";
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
    if (game.players.w === user.uid) return 'w';
    if (game.players.b === user.uid) return 'b';
    return null;
  }, [game, user]);

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch((err) => {
          setError("Failed to sign in. Please refresh the page.");
          console.error("Anonymous sign-in error:", err);
        });
      }
    });
    return () => authUnsubscribe();
  }, []);

  useEffect(() => {
    if (!gameId || !user) return;

    setLoading(true);
    const gameRef = doc(db, "games", gameId);

    const gameUnsubscribe = onSnapshot(gameRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const gameData = { id: docSnap.id, ...docSnap.data() } as Game;

          // Attempt to join the game if a slot is open
          if (user.uid !== gameData.players.w && user.uid !== gameData.players.b) {
            if (gameData.players.w === null) {
              updateDoc(gameRef, { "players.w": user.uid });
            } else if (gameData.players.b === null) {
              updateDoc(gameRef, { "players.b": user.uid, status: "in_progress" });
            }
          }
          setGame(gameData);
          setError(null);
        } else {
          setError("Game not found.");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Game snapshot error:", err);
        setError("Failed to load game data.");
        setLoading(false);
      }
    );
    
    const chatQuery = query(collection(db, `games/${gameId}/chat`), orderBy("timestamp", "asc"));
    const chatUnsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
        const messages: ChatMessage[] = [];
        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
        });
        setChatMessages(messages);
    });

    return () => {
      gameUnsubscribe();
      chatUnsubscribe();
    };
  }, [gameId, user]);
  
  const makeMove = useCallback(async (from: Square, to: Square) => {
    if (!chess || !game || !playerColor || chess.turn() !== playerColor) return;

    try {
        const move = chess.move({ from, to, promotion: 'q' });
        if (move === null) {
            toast({ title: "Invalid Move", description: "That move is not allowed.", variant: "destructive"});
            return;
        }

        let newStatus: GameStatus = "in_progress";
        if (chess.isCheckmate()) newStatus = "checkmate";
        else if (chess.isStalemate()) newStatus = "stalemate";
        else if (chess.isDraw()) newStatus = "draw";

        await updateDoc(doc(db, "games", gameId), {
            fen: chess.fen(),
            pgn: chess.pgn(),
            turn: chess.turn(),
            status: newStatus,
        });
    } catch (e) {
        console.error("Failed to make move:", e);
        // Revert local state if firebase update fails
        chess.undo();
        setGame(game);
        toast({ title: "Move Failed", description: "Could not sync your move. Please try again.", variant: "destructive"});
    }
  }, [chess, game, playerColor, gameId, toast]);

  const sendMessage = useCallback(async (text: string) => {
    if (!user || !playerColor) return;
    try {
        await addDoc(collection(db, `games/${gameId}/chat`), {
            text,
            sender: playerColor,
            uid: user.uid,
            timestamp: serverTimestamp()
        });
    } catch (e) {
        console.error("Failed to send message:", e);
        toast({ title: "Chat Error", description: "Could not send your message.", variant: "destructive"});
    }
  }, [user, playerColor, gameId, toast]);


  return { game, chess, playerColor, loading, error, makeMove, sendMessage, chatMessages };
}
