import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GamePhase, GameSettings, Player, RoundData } from "../types";
import { THESES } from "../constants/Theses";

interface GameState {
  // Persistent Settings
  settings: GameSettings;
  setWinningScore: (score: 3 | 5 | 10) => void;
  toggleSound: () => void;
  toggleTheme: () => void;

  // Session State
  players: Player[];
  phase: GamePhase;
  roundNumber: number;
  roundData: RoundData | null;
  winnerId: string | null;

  // Actions
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  resetGame: () => void;
  startGame: () => void;
  startRound: () => void;
  nextPhase: () => void; // Transitions timer phases
  submitVotes: (votes: Record<string, string>) => void; // voterId -> votedPlayerId
  endGame: () => void;
}

// Helper to get random item
const getRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      settings: {
        winningScore: 5,
        isSoundEnabled: true,
        isDarkMode: false,
      },
      players: [],
      phase: "SETUP",
      roundNumber: 0,
      roundData: null,
      winnerId: null,

      setWinningScore: (score) =>
        set((state) => ({
          settings: { ...state.settings, winningScore: score },
        })),

      toggleSound: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            isSoundEnabled: !state.settings.isSoundEnabled,
          },
        })),

      toggleTheme: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            isDarkMode: !state.settings.isDarkMode,
          },
        })),

      addPlayer: (name) =>
        set((state) => ({
          players: [
            ...state.players,
            { id: Date.now().toString() + Math.random(), name, score: 0 },
          ],
        })),

      removePlayer: (id) =>
        set((state) => ({
          players: state.players.filter((p) => p.id !== id),
        })),

      resetGame: () =>
        set({
          players: [],
          phase: "SETUP",
          roundNumber: 0,
          roundData: null,
          winnerId: null,
        }),

      startGame: () => {
        const { players } = get();
        if (players.length < 3) return;

        // Reset scores
        const resetPlayers = players.map((p) => ({ ...p, score: 0 }));

        set({
          players: resetPlayers,
          phase: "DEFENSE", // Will be set by startRound actually
          roundNumber: 0,
          winnerId: null,
        });

        get().startRound();
      },

      startRound: () => {
        const { players, settings, roundNumber } = get();

        // Check for winner first
        const winner = players.find((p) => p.score >= settings.winningScore);
        if (winner) {
          set({ phase: "GAME_OVER", winnerId: winner.id });
          return;
        }

        // Select Defender and Opponent
        // Simple random logic for now, ensuring unique
        let defender = getRandom(players);
        let opponent = getRandom(players);

        while (opponent.id === defender.id) {
          opponent = getRandom(players);
        }

        const judgeIds = players
          .filter((p) => p.id !== defender.id && p.id !== opponent.id)
          .map((p) => p.id);

        const thesis = getRandom(THESES);

        set({
          phase: "DEFENSE",
          roundNumber: roundNumber + 1,
          roundData: {
            defenderId: defender.id,
            opponentId: opponent.id,
            thesis,
            judgeIds,
          },
        });
      },

      nextPhase: () => {
        const { phase } = get();
        if (phase === "DEFENSE") set({ phase: "OFFENSE" });
        else if (phase === "OFFENSE") set({ phase: "DISCUSSION" });
        else if (phase === "DISCUSSION") set({ phase: "VOTING" });
      },

      submitVotes: (votes) => {
        const { players, roundData } = get();
        if (!roundData) return;

        const newPlayers = [...players];

        Object.values(votes).forEach((votedId) => {
          const playerIndex = newPlayers.findIndex((p) => p.id === votedId);
          if (playerIndex !== -1) {
            newPlayers[playerIndex].score += 1;
          }
        });

        set({ players: newPlayers, phase: "ROUND_END" });
      },

      endGame: () => {
        set({ phase: "SETUP" });
      },
    }),
    {
      name: "dibattito-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ settings: state.settings }), // Only persist settings
    },
  ),
);
