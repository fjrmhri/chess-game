# **App Name**: Firebase Chess Royale

## Core Features:

- Match Creation: Players can create a new chess match, which generates a unique game ID.
- Match Joining: Players can join an existing match by entering a game ID. This functionality uses Firebase to check availability and update the game state.
- Real-time Gameplay: Implements the core chess logic, ensuring legal moves, turn management, and game over conditions. Updates are synchronized in real-time using Firebase.
- In-Game Chat: A real-time chat feature within each match, allowing players to communicate using Firebase.
- Game State Persistence: Uses Firebase to store and retrieve game state, including board configuration, move history, and player information.
- AI Move Suggestion Tool: Offers move suggestions to players during the game based on the current board state. LLM reasons if it has enough data and confidence to produce useful move.

## Style Guidelines:

- Primary color: Deep indigo (#4B0082) for a regal, intellectual feel.
- Background color: Light gray (#E0E0E0) to provide a neutral backdrop.
- Accent color: Golden yellow (#FFD700) to highlight interactive elements and important game states (e.g., check).
- Body and headline font: 'Alegreya', a humanist serif font, which evokes a intellectual, contemporary, yet also somewhat literary feel
- Use a set of clean, minimalist icons for chess pieces. The icons should be easily distinguishable and adapt well to different screen sizes.
- The chessboard should be prominently displayed, with chat and player info arranged in side panels for a balanced, intuitive interface.
- Subtle transitions and animations (e.g., piece movement) to provide clear feedback to the player without being distracting.