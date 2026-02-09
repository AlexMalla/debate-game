export interface Player {
  id: string;
  name: string;
  score: number;
}

export type GamePhase = 'SETUP' | 'DEFENSE' | 'OFFENSE' | 'DISCUSSION' | 'VOTING' | 'ROUND_END' | 'GAME_OVER';

export interface GameSettings {
  winningScore: 3 | 5 | 10;
  isSoundEnabled: boolean;
  isDarkMode: boolean;
}

export interface RoundData {
  defenderId: string;
  opponentId: string;
  thesis: string;
  judgeIds: string[];
}

export type TimerStatus = 'RUNNING' | 'PAUSED' | 'STOPPED';
