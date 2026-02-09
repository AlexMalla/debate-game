import { useGameStore } from "../store/useGameStore";
import { Colors } from "../constants/Colors";

type Theme = typeof Colors.light;

export const useThemeColors = (): Theme => {
  const isDarkMode = useGameStore((state) => state.settings.isDarkMode);
  return isDarkMode ? Colors.dark : Colors.light;
};
