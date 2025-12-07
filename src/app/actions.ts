"use server";

import { aiMoveSuggestion } from "@/ai/ai-move-suggestion";

export async function getAiSuggestion(fen: string, pgn: string) {
  try {
    const result = await aiMoveSuggestion({ boardState: fen, moveHistory: pgn });
    return { success: true, suggestion: result.suggestedMove };
  } catch (error) {
    console.error("Error getting AI suggestion:", error);
    return { success: false, error: "Failed to get suggestion from AI." };
  }
}
