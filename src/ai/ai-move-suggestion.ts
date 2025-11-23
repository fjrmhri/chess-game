'use server';

/**
 * @fileOverview AI move suggestion flow.
 *
 * - aiMoveSuggestion - A function that suggests a chess move based on the current board state.
 * - AiMoveSuggestionInput - The input type for the aiMoveSuggestion function.
 * - AiMoveSuggestionOutput - The return type for the aiMoveSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiMoveSuggestionInputSchema = z.object({
  boardState: z.string().describe('FEN representation of the current chess board state.'),
  moveHistory: z.string().optional().describe('PGN representation of the game move history.'),
});
export type AiMoveSuggestionInput = z.infer<typeof AiMoveSuggestionInputSchema>;

const AiMoveSuggestionOutputSchema = z.object({
  suggestedMove: z.string().describe('Suggested move in algebraic notation.'),
  reasoning: z.string().describe('Reasoning behind the suggested move.'),
  confidence: z.number().describe('A number between 0 and 1 indicating the AI models confidence in the quality of the move.'),
});
export type AiMoveSuggestionOutput = z.infer<typeof AiMoveSuggestionOutputSchema>;

export async function aiMoveSuggestion(input: AiMoveSuggestionInput): Promise<AiMoveSuggestionOutput> {
  return aiMoveSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMoveSuggestionPrompt',
  input: {schema: AiMoveSuggestionInputSchema},
  output: {schema: AiMoveSuggestionOutputSchema},
  prompt: `You are a grandmaster chess player providing move suggestions to a student.

  Given the current board state in FEN notation: {{{boardState}}}
  And the move history in PGN notation (if available): {{{moveHistory}}}

  Provide a single move suggestion in algebraic notation, along with a brief explanation of your reasoning.
  Also provide a single number indicating your confidence in the quality of the move between 0 and 1.

  Ensure that the suggested move is legal and follows chess rules.

  Output in JSON format.`,
});

const aiMoveSuggestionFlow = ai.defineFlow(
  {
    name: 'aiMoveSuggestionFlow',
    inputSchema: AiMoveSuggestionInputSchema,
    outputSchema: AiMoveSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
