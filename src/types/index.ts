export interface Player {
  id: string;
  name: string;
  score: number;
}

export type GamePhase =
  | "SETUP"
  | "ROUND_INTRO"
  | "DEFENSE"
  | "OFFENSE"
  | "DISCUSSION"
  | "VOTING"
  | "ROUND_END"
  | "GAME_OVER";

export type GameMode = "all_vs_all" | "quick";

export interface GameSettings {
  gameMode: "quick" | "all_vs_all";
  isSoundEnabled: boolean;
  isDarkMode: boolean;
  removeFinalDiscussion: boolean;
  roundDuration: number;
}

export interface RoundData {
  defenderId: string;
  opponentId: string;
  thesis: string;
  judgeIds: string[];
}

export type TimerStatus = "RUNNING" | "PAUSED" | "STOPPED";
