# Firebase Chess Royale

This is a real-time multiplayer chess game built with Next.js, Firebase, and Tailwind CSS. It allows players to create or join games, play chess against each other, and communicate via in-game chat. The app also features an AI-powered move suggestion tool.

This project is bootstrapped with `create-next-app` and uses `shadcn/ui` for components.

## Tech Stack

- **Frontend:** Next.js (React with TypeScript)
- **Backend & Real-time:** Firebase (Firestore for game state/chat, Firebase Auth for anonymous users)
- **Styling:** Tailwind CSS with shadcn/ui
- **Chess Logic:** `chess.js`
- **AI:** Genkit on Firebase

## Features

- Create and join multiplayer chess games.
- Real-time synchronization of game state.
- In-game chat for players.
- Legal move validation, check, and checkmate detection.
- AI move suggestion tool.
- Modern, responsive, and accessible UI.

## Project Structure

The project follows a standard Next.js App Router structure, with clear separation of concerns:

- `src/app/`: Page routes and layouts.
- `src/components/`: Reusable React components.
  - `src/components/game/`: Components specific to the chess game.
  - `src/components/ui/`: Auto-generated `shadcn/ui` components.
- `src/config/`: Firebase and other configurations.
- `src/hooks/`: Custom React hooks, like `useGameRoom` for managing game logic.
- `src/lib/`: Core library functions, including Firebase initialization.
- `src/types/`: TypeScript type definitions.
- `src/ai/`: Genkit AI flows (provided externally).
- `agent.md`: A detailed developer guide for understanding the architecture and contributing to the project.

## Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
2. Go to Project Settings > General and find your project's configuration under "Your apps".
3. Create a `.env.local` file in the root of the project by copying `.env.local.example`.
4. Fill in the `.env.local` file with your Firebase project's configuration keys.
5. In the Firebase console, go to "Authentication" and enable the "Anonymous" sign-in provider.
6. Go to "Firestore Database", create a database, and start in "test mode" for initial development (you should configure proper security rules for production).

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## How to Play

1.  **Create a Game:** On the home page, click "Create New Game". You'll be redirected to a new game room.
2.  **Join a Game:** Share the URL of the game room (e.g., `http://localhost:9002/game/your-game-id`) with another player. When they open the link, they will automatically join the game.
3.  **Play:** Pieces are moved by clicking on a piece and then clicking on a valid destination square. The board updates in real-time for both players.
4.  **Chat:** Use the chat panel to send messages to your opponent.
5.  **AI Suggestion:** Click "Get Suggestion" to receive a move suggestion from the AI.

## Deployment on Vercel

The project is pre-configured for deployment on Vercel.

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the repository into Vercel.
3.  Vercel will automatically detect that it's a Next.js project.
4.  Add your Firebase environment variables from `.env.local` to the Vercel project's "Environment Variables" settings.
5.  Deploy!
