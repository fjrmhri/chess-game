import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { z } from 'zod';

export const ai = genkit({
  plugins: [googleAI()],
  // Force structured output format for all generate calls
  // unless explicitly specified otherwise.
  // We are using JSON for this app.
  output: {
    format: 'json',
    schema: z.any(),
  },
  model: 'googleai/gemini-1.5-flash-latest',
});
