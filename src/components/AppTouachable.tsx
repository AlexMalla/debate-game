import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../constants/Colors";
import { useThemeColors } from "../hooks/useThemeColors";

interface AppTouchableProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  active?: boolean;
  style?: ViewStyle;
}

export const AppTouchable: React.FC<AppTouchableProps> = ({
  children,
  onPress,
  disabled = false,
  active = false,
  style,
}) => {
  const themeColors = useThemeColors();

  const backgroundColor = () => {
    if (disabled) return themeColors.border;
    if (active) return Colors.primary;
    return themeColors.card;
  };

  const borderColor = () => {
    if (active) return Colors.primary;
    return themeColors.border;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor(),
          borderColor: borderColor(),
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});
