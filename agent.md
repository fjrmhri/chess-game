# Firebase Chess Royale - Development Guide

This document provides a high-level overview of the Firebase Chess Royale project architecture, key implementation details, and guidelines for future development.

## 1. High-Level Architecture

The application is a modern web app built on a serverless, real-time architecture.

-   **Frontend**: A Next.js application using the App Router. Components are built with React and TypeScript, styled with Tailwind CSS, and utilize `shadcn/ui` for the component library.
-   **Backend**: Firebase serves as the backend-as-a-service (BaaS).
    -   **Firestore**: Used as the primary database to store game state, player information, and chat messages in real-time.
    -   **Firebase Authentication**: Handles player identity through the "Anonymous" sign-in provider. This gives each user a stable, unique ID without requiring them to create an account.
-   **AI**: Genkit flows, assumed to be running on Firebase, are used for the "Move Suggestion" feature. These are accessed via Next.js Server Actions.

## 2. Folder Structure and Purpose

-   `src/app/`: Contains all routes.
    -   `page.tsx`: The home/lobby page where users can create or join a game.
    -   `game/[gameId]/page.tsx`: The main game view, which is a client component that fetches and displays a specific game.
    -   `actions.ts`: Next.js Server Actions, used to communicate with the AI backend securely.
-   `src/components/`:
    -   `game/`: Contains all React components specifically designed for the chess game (e.g., `Board`, `Square`, `Piece`, `Chat`).
    -   `ui/`: The `shadcn/ui` component library.
-   `src/config/`:
    -   `firebase.ts`: Holds the Firebase configuration keys, pulling them from environment variables.
-   `src/hooks/`:
    -   `useGameRoom.ts`: This is the most important custom hook in the application. It encapsulates all the logic for a single game room, including fetching data, subscribing to real-time updates, handling player moves, and managing chat.
-   `src/lib/`:
    -   `firebase.ts`: Initializes the Firebase app and exports the Firestore and Auth instances.
-   `src/types/`:
    -   `index.ts`: Defines all shared TypeScript types and interfaces (`Game`, `Player`, `ChatMessage`, etc.).
-   `tests/`: (Placeholder) For future unit and integration tests.
-   `docs/`: (Placeholder) For future in-depth documentation.

## 3. Real-Time Chess Synchronization

The real-time gameplay is the core feature of the application. Here’s how it works:

1.  **Data Model**: Each chess game is represented by a single document in the `games` collection in Firestore. The document ID is the `gameId`. This document stores the FEN string (`fen`), move history (`pgn`), game status (`status`), current turn (`turn`), and player info (`players`).
2.  **Subscription**: When a player joins a game room (`/game/[gameId]`), the `useGameRoom` hook subscribes to real-time updates for that game's document using Firestore's `onSnapshot` listener.
3.  **Local State**: The hook uses the `chess.js` library to manage the game's logic locally. The FEN string from Firestore is loaded into a `chess.js` instance.
4.  **Making a Move**:
    -   A player interacts with the `Board` component to select and move a piece.
    -   The move is validated locally using `chess.js`.
    -   If the move is legal, the `useGameRoom` hook executes an `updateDoc` operation on the Firestore document, updating the `fen`, `pgn`, `turn`, and `status` fields.
5.  **Synchronization**:
    -   Because both players' clients are subscribed to the same document, Firestore automatically pushes the update to the opponent's client.
    -   The `onSnapshot` listener on the opponent's client fires, providing the new game data.
    -   The `useGameRoom` hook updates its state with the new data, which causes the React UI (the `Board`) to re-render, showing the move.

This client-side prediction (validating the move locally first) makes the UI feel instantaneous for the active player, while Firestore ensures the state is authoritatively synchronized across all clients.

## 4. Chat System Implementation

The chat system is built using a subcollection in Firestore, which is an efficient way to handle lists of data related to a parent document.

1.  **Data Model**: Inside each game document (`games/{gameId}`), there is a subcollection named `chat`. Each message is a document in this subcollection.
2.  **Sending Messages**: When a player sends a message, an `addDoc` operation creates a new document in the `chat` subcollection containing the message text, sender's UID, and a server timestamp.
3.  **Receiving Messages**: The `useGameRoom` hook also sets up an `onSnapshot` listener on the `chat` subcollection (ordered by timestamp). When a new message is added, the listener receives the updated query snapshot, and the hook updates the local chat state, causing the `Chat` component to display the new message.

## 5. Guidelines for Future Development

-   **Adding New Features**:
    -   **Rankings/ELO**: Create a new `users` collection in Firestore to store player profiles, including their ELO rating. After a game ends, use a Cloud Function (or a server action) to calculate and update the ELO for both players.
    -   **AI Opponent**: The current AI suggests moves. To create an AI opponent, you would create a game where one of the `players` is an "AI" entity. When it's the AI's turn, a Cloud Function or a server-side process would be triggered to call the Genkit flow, get a move, and update the game state on behalf of the AI.
    -   **User Profiles**: Expand the `users` collection to include display names, avatars, and game history. This would require moving from anonymous auth to a provider like Google or Email/Password.

-   **Coding Style & Best Practices**:
    -   **Keep Components Dumb**: Components in `src/components/` should be as presentational as possible. All complex logic, state management, and side effects should be handled in hooks (`src/hooks/`).
    -   **Centralize Firebase Logic**: All direct interactions with Firebase should be within the `useGameRoom` hook or other custom hooks. Components should not call `getDoc` or `updateDoc` directly.
    -   **Type Safety**: Continue to use TypeScript and define clear types for all data structures in `src/types/`.
    -   **Environment Variables**: Never hardcode API keys or secrets. Always use environment variables (`.env.local`) and reference them through the `src/config/` files.
    -   **Security Rules**: For a production application, implement strict Firestore Security Rules to prevent unauthorized data access and manipulation. For example, ensure only the current player can make a move and that moves are valid.
