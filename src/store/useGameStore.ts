import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GamePhase, GameSettings, Player, RoundData } from "../types";
import { THESES } from "../constants/Theses";
import { shuffleAvoidingBackToBack } from "../utils/functions";

interface SessionPlayer extends Player {
  participationCount: number;
}

interface GameState {
  settings: GameSettings;
  setGameMode: (mode: "quick" | "all_vs_all") => void;
  toggleSound: () => void;
  toggleTheme: () => void;
  toggleFinalDiscussion: () => void;
  setRoundDuration: (duration: 30 | 60 | 120) => void;
  estimateGameDuration: () => number;
  estimateGameDurationFormatted: () => string;
  players: SessionPlayer[];
  activeDebaterIds: string[];

  phase: GamePhase;
  roundNumber: number;
  roundData: RoundData | null;
  winnerIds: string[] | null;
  totalRounds: number;

  matchupQueue: { defenderId: string; opponentId: string }[];
  lastMatchPlayerIds: string[] | null;

  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  resetGame: () => void;
  startGame: () => void;
  startRound: () => void;
  nextPhase: () => void;
  submitVotes: (votes: Record<string, string>) => void;
  endGame: () => void;
}

const getRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const shuffle = <T>(arr: T[]) => arr.slice().sort(() => Math.random() - 0.5);

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // ───────── SETTINGS ─────────
      settings: {
        gameMode: "all_vs_all",
        isSoundEnabled: true,
        isDarkMode: false,
        removeFinalDiscussion: false,
        roundDuration: 60,
      },

      setGameMode: (mode) =>
        set((s) => ({ settings: { ...s.settings, gameMode: mode } })),

      toggleSound: () =>
        set((s) => ({
          settings: {
            ...s.settings,
            isSoundEnabled: !s.settings.isSoundEnabled,
          },
        })),

      toggleTheme: () =>
        set((s) => ({
          settings: {
            ...s.settings,
            isDarkMode: !s.settings.isDarkMode,
          },
        })),

      toggleFinalDiscussion: () =>
        set((s) => ({
          settings: {
            ...s.settings,
            removeFinalDiscussion: !s.settings.removeFinalDiscussion,
          },
        })),

      setRoundDuration: (duration) =>
        set((s) => ({
          settings: {
            ...s.settings,
            roundDuration: duration,
          },
        })),

      // ───────── SESSION ─────────
      players: [],
      activeDebaterIds: [],

      phase: "SETUP",
      roundNumber: 0,
      roundData: null,
      winnerIds: null,
      totalRounds: 0,

      matchupQueue: [],
      lastMatchPlayerIds: null,

      // ───────── ACTIONS ─────────
      addPlayer: (name) =>
        set((s) => ({
          players: [
            ...s.players,
            {
              id: Date.now().toString() + Math.random(),
              name,
              score: 0,
              participationCount: 0,
            },
          ],
        })),

      removePlayer: (id) =>
        set((s) => ({
          players: s.players.filter((p) => p.id !== id),
        })),

      resetGame: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            gameMode: "quick",
          },
          players: [],
          activeDebaterIds: [],
          phase: "SETUP",
          roundNumber: 0,
          roundData: null,
          winnerIds: null,
          totalRounds: 0,
          matchupQueue: [],
          lastMatchPlayerIds: null,
        })),

      // ───────── START GAME ─────────
      startGame: () => {
        const { players, settings } = get();
        if (players.length < 3) return;

        const resetPlayers = players.map((p) => ({
          ...p,
          score: 0,
          participationCount: 0,
        }));

        const activeDebaterIds = resetPlayers.map((p) => p.id);

        const debaterPool = resetPlayers.filter((p) =>
          activeDebaterIds.includes(p.id),
        );

        let matchupQueue: { defenderId: string; opponentId: string }[] = [];
        let totalRounds = 0;

        if (settings.gameMode === "quick") {
          totalRounds = Math.ceil(debaterPool.length / 2);
        } else {
          for (let i = 0; i < debaterPool.length; i++) {
            for (let j = i + 1; j < debaterPool.length; j++) {
              matchupQueue.push({
                defenderId: debaterPool[i].id,
                opponentId: debaterPool[j].id,
              });
            }
          }
          matchupQueue = shuffleAvoidingBackToBack(matchupQueue);
          totalRounds = matchupQueue.length;
        }

        set({
          players: resetPlayers,
          activeDebaterIds,
          phase: "ROUND_INTRO",
          roundNumber: 0,
          winnerIds: null,
          totalRounds,
          matchupQueue,
          lastMatchPlayerIds: null,
        });

        get().startRound();
      },

      // ───────── START ROUND ─────────
      startRound: () => {
        const {
          players,
          activeDebaterIds,
          roundNumber,
          totalRounds,
          settings,
          matchupQueue,
          lastMatchPlayerIds,
        } = get();

        if (totalRounds > 0 && roundNumber >= totalRounds) {
          get().endGame();
          return;
        }

        let defender: SessionPlayer;
        let opponent: SessionPlayer;
        let newMatchupQueue = [...matchupQueue];

        if (settings.gameMode === "all_vs_all") {
          const next = newMatchupQueue.shift();
          if (!next) {
            get().endGame();
            return;
          }

          defender = players.find((p) => p.id === next.defenderId)!;
          opponent = players.find((p) => p.id === next.opponentId)!;
        } else {
          const debaterPool = players.filter((p) =>
            activeDebaterIds.includes(p.id),
          );

          let selectable = debaterPool;

          if (lastMatchPlayerIds && debaterPool.length > 2) {
            selectable = debaterPool.filter(
              (p) => !lastMatchPlayerIds.includes(p.id),
            );

            if (selectable.length < 2) {
              selectable = debaterPool;
            }
          }

          const shuffled = shuffle(selectable);
          defender = shuffled[0];
          opponent = shuffled[1];
        }

        const judgeIds = players
          .filter((p) => p.id !== defender.id && p.id !== opponent.id)
          .map((p) => p.id);

        set((state) => ({
          phase: "ROUND_INTRO",
          roundNumber: state.roundNumber + 1,
          roundData: {
            defenderId: defender.id,
            opponentId: opponent.id,
            thesis: getRandom(THESES),
            judgeIds,
          },
          matchupQueue: newMatchupQueue,
          lastMatchPlayerIds: [defender.id, opponent.id],
          players: state.players.map((p) =>
            p.id === defender.id || p.id === opponent.id
              ? { ...p, participationCount: p.participationCount + 1 }
              : p,
          ),
        }));
      },

      // ───────── FLOW ─────────
      nextPhase: () => {
        const { phase, settings } = get();

        if (phase === "ROUND_INTRO") set({ phase: "DEFENSE" });
        else if (phase === "DEFENSE") set({ phase: "OFFENSE" });
        else if (phase === "OFFENSE") {
          if (!settings.removeFinalDiscussion) set({ phase: "DISCUSSION" });
          else set({ phase: "VOTING" });
        } else if (phase === "DISCUSSION") {
          set({ phase: "VOTING" });
        }
      },

      // ───────── VOTING ─────────
      submitVotes: (votes) => {
        const { players, roundData } = get();
        if (!roundData) return;

        const updated = players.map((p) => ({ ...p }));

        Object.values(votes).forEach((id) => {
          const target = updated.find((p) => p.id === id);
          if (target) target.score += 1;
        });

        set({ players: updated, phase: "ROUND_END" });
      },

      endGame: () => {
        const { players } = get();
        const maxScore = Math.max(...players.map((p) => p.score));
        const winners = players
          .filter((p) => p.score === maxScore)
          .map((p) => p.id);

        set({ phase: "GAME_OVER", winnerIds: winners });
      },

      // ───────── GAME DURATION ESTIMATION ─────────
      estimateGameDuration: () => {
        const { players, settings, totalRounds } = get();
        const playerCount = players.length;

        if (playerCount < 3) return 0;

        let estimatedRounds = totalRounds;
        if (estimatedRounds === 0) {
          if (settings.gameMode === "quick") {
            estimatedRounds = Math.ceil(playerCount / 2);
          } else {
            estimatedRounds = (playerCount * (playerCount - 1)) / 2; // all vs all
          }
        }

        const roundBaseTime = settings.roundDuration * 2; // durata round tesi + antitesi
        const discussionTime = settings.removeFinalDiscussion
          ? 0
          : settings.roundDuration; // discussione finale
        const judgeTime = 10; // 10s per giudice
        const averageJudges = Math.max(playerCount - 2, 0);

        const singleRoundTime =
          roundBaseTime + discussionTime + judgeTime * averageJudges;

        return singleRoundTime * estimatedRounds; // in secondi
      },

      estimateGameDurationFormatted: () => {
        const totalTime = get().estimateGameDuration();
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;

        if (minutes > 0 && seconds > 0) return `${minutes} min ${seconds} s`;
        if (minutes > 0) return `${minutes} min`;
        return `${seconds} s`;
      },
    }),
    {
      name: "dibattito-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ settings: s.settings }),
    },
  ),
);
