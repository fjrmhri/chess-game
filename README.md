# Firebase Chess Royale

Real-time chess with Next.js (React + TypeScript) on Firebase. Create or join multiplayer rooms that sync boards, moves, and chat through Firestore, or play locally against a built-in bot—all using the same polished UI. Deploy quickly to Vercel without custom servers.

## Features
- **Multiplayer**: Create/join rooms, auto-seat players, and keep presence flags updated.
- **Bot mode**: Play locally against a minimax-powered bot that reuses the same board and rules.
- **Full chess rules**: Legal move validation, check, checkmate, stalemate, draws, and resignation.
- **Real-time chat**: Per-room chat stored in Firestore subcollections, auto-scrolling to new messages.
- **Compact UI**: Responsive layout keeps board, controls, and chat visible without scrolling on typical desktops.
- **Deployable to Vercel**: Pure client + Firebase integration—no custom server required.

## Tech Stack
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: Firebase Firestore + Firebase Auth (anonymous sign-in).
- **Chess logic**: `chess.js` for rules/validation and a custom minimax evaluator for the bot.

## Getting Started
### Prerequisites
- Node.js 18+
- A Firebase project with Firestore and Anonymous Authentication enabled.

### Installation
```bash
npm install
cp .env.local.example .env.local
```

Fill `.env.local` with your Firebase config keys:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Run Locally
```bash
npm run dev
```
Open http://localhost:9002 to play.

### Deployment (Vercel)
1. Push this repo to GitHub.
2. Create a new Vercel project and import the repo.
3. Add the same Firebase environment variables in Vercel Project Settings.
4. Deploy—no additional server setup needed.

## Usage
### Multiplayer
1. On the lobby, choose **"Multiplayer: Create Room"** or enter an existing Game ID to join.
2. Invite an opponent by sharing the Game ID (URL includes it).
3. Play turns on the synced board; status, last move times, and presence are stored in Firestore.
4. Use the chat panel to talk—messages stream live without blocking gameplay.
5. Resign anytime from the action bar.

### Play vs Bot
1. From the lobby, click **"Play vs Bot"**.
2. Pick White or Black, then play locally. The minimax bot responds immediately using the shared rules engine.
3. Restart or switch colors from the control panel.

## Project Structure (high level)
- `src/app/` – Pages (`/`, `/game/[gameId]`, `/bot`).
- `src/components/game/` – Chess UI (board, status, chat, actions).
- `src/hooks/` – Game state management (`useGameRoom` for Firestore, `useBotGame` for local bot play).
- `src/config/` & `src/lib/` – Firebase configuration/initialization.
- `src/utils/` – Bot evaluation helpers.
- `src/types/` – Shared TypeScript types.

## Contributing
Issues and pull requests are welcome! Please keep components presentational and prefer hooks for side effects and Firebase calls.

## License
MIT
