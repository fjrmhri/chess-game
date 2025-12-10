"use client";

import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Loader2 } from "lucide-react";

import { getAiSuggestion } from "@/app/actions";

interface SuggestionProps {
  fen: string;
  pgn: string;
  disabled: boolean;
}

export function Suggestion({ fen, pgn, disabled }: SuggestionProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestion = async () => {
    if (loading || disabled) return;

    setLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const result = await getAiSuggestion(fen, pgn);
      if (result.success && result.suggestion) {
        setSuggestion(result.suggestion);
      } else {
        setSuggestion(null);
        setError(
          result.error ?? "Tidak dapat memuat saran langkah atau saran kosong."
        );
      }
    } catch (fetchError) {
      setError("Gagal meminta saran. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Lightbulb className="w-5 h-5" />
          AI Move Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGetSuggestion}
          disabled={loading || disabled}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Suggestion...
            </>
          ) : (
            "Get Suggestion"
          )}
        </Button>
        {suggestion && (
          <Alert>
            <AlertTitle>Suggested Move</AlertTitle>
            <AlertDescription className="font-mono text-lg">
              {suggestion}
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
