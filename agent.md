# Firebase Chess Royale - Development Guide

This document summarizes the architecture, data model, and extension points for the real-time multiplayer and bot-enabled chess experience.

## 1) Architecture Overview
- **Frontend**: Next.js App Router using React + TypeScript, Tailwind CSS, and shadcn/ui. Pages live under `src/app/` (`/`, `/game/[gameId]`, `/bot`).
- **Backend (multiplayer only)**: Firebase Firestore stores game rooms, board state (FEN/PGN), move metadata, presence, and chat. Firebase Auth (anonymous) provides stable player IDs.
- **AI/Bot**: Client-side minimax implemented in `src/utils/botEngine.ts`, orchestrated by `useBotGame`. No external services are required for bot play.

## 2) Key Folders
- `src/components/game/`: Presentational chess UI (Board, Chat, GameInfo, ActionBar, GameOverDialog, Suggestion).
- `src/hooks/`: State + side effects. `useGameRoom` handles Firestore sync, seating, presence, and chat; `useBotGame` drives local bot games.
- `src/utils/`: Helper utilities (bot evaluator and move search logic).
- `src/types/`: Shared types for games, presence snapshots, chat messages, and modes.
- `src/config/` & `src/lib/`: Firebase config and initialization.

## 3) Data Flow
- **Multiplayer moves**: Board interactions call `makeMove` (from `useGameRoom`). Moves validate locally via `chess.js`, then update the `games/{id}` document with `fen`, `pgn`, `turn`, `status`, `winner`, `lastMoveAt`, and refreshed presence. Opponents receive updates through Firestore `onSnapshot` listeners.
- **Multiplayer chat**: Messages are `addDoc`’d to `games/{id}/chat` and streamed with an ordered `onSnapshot`. UI auto-scrolls to the latest message without blocking gameplay.
- **Presence**: `presence.{w,b}` stores `{ online, lastActive }`. Visibility and unload events mark players offline while keeping minimal writes.
- **Bot mode**: `useBotGame` keeps a single `chess.js` instance. Player moves reuse the same board components and validation; the bot replies with `findBestMove` (depth-limited minimax). Everything stays client-side.

## 4) Bot Implementation & Extensions
- **Engine**: `findBestMove` scores positions with material + mobility and runs alpha-beta minimax. Depth defaults to 3 plies; adjust via `useBotGame` options.
- **Extending AI**: Add positional tables, iterative deepening, or time controls in `botEngine.ts`. Difficulty levels can map to depth or evaluation tweaks.

## 5) Future Feature Guidelines
- **AI difficulty selector**: Expose a depth selector in the bot controls; pass through to `useBotGame`.
- **Rankings/Profiles**: Introduce a `users` collection storing ELO and display names. Update ratings after each game (Cloud Function or server action) and surface names in `GameInfo`.
- **Match history**: Persist PGN/move summaries to a `history` subcollection for each user. Reuse existing FEN/PGN fields as the canonical record.
- **Security**: Keep Firebase rules strict—only allow authenticated users to write to their game slot and validate move legality server-side if expanded.

## 6) UI/UX Notes
- Board width is capped for compact layouts; side panels house status, actions (resign/restart), chat, and AI suggestions without scrolling on common desktop resolutions.
- Components remain presentational; heavy logic belongs in hooks.
