import { useCallback, useRef } from "react";
import { Audio, AVPlaybackStatus } from "expo-av";
import { useGameStore } from "../store/useGameStore";

type SoundKey = "start" | "pause" | "end" | "next" | "vote" | "click";

const SOUND_SOURCES: Record<SoundKey, string> = {
  start:
    "https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-positive-notification-266.wav",
  pause: "https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.wav",
  end: "https://assets.mixkit.co/sfx/preview/mixkit-retro-game-notification-957.wav",
  next: "https://assets.mixkit.co/sfx/preview/mixkit-quick-win-video-game-2013.wav",
  vote: "https://assets.mixkit.co/sfx/preview/mixkit-typewriter-click-1125.wav",
  click: "https://assets.mixkit.co/sfx/preview/mixkit-light-button-2569.wav",
};

export const useSound = () => {
  const isSoundEnabled = useGameStore((s) => s.settings.isSoundEnabled);
  const cache = useRef<Record<SoundKey, Audio.Sound | null>>({
    start: null,
    pause: null,
    end: null,
    next: null,
    vote: null,
    click: null,
  });

  const play = useCallback(
    async (key: SoundKey) => {
      if (!isSoundEnabled) return;

      try {
        let sound = cache.current[key];
        if (!sound) {
          sound = new Audio.Sound();
          await sound.loadAsync({ uri: SOUND_SOURCES[key] }, { volume: 0.7 });
          cache.current[key] = sound;
        }

        const status = (await sound.getStatusAsync()) as AVPlaybackStatus;
        if (status.isLoaded && status.isPlaying) {
          await sound.stopAsync();
        }
        await sound.setPositionAsync(0);
        await sound.playAsync();
      } catch {}
    },
    [isSoundEnabled],
  );

  return { play };
};
