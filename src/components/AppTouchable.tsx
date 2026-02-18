import React, { useRef } from "react";
import {
  StyleSheet,
  ViewStyle,
  Animated,
  Pressable,
  Platform,
  StyleProp,
} from "react-native";
import { Colors, Spacing } from "../constants/Colors";
import { useThemeColors } from "../hooks/useThemeColors";

interface AppTouchableProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export const AppTouchable: React.FC<AppTouchableProps> = ({
  children,
  onPress,
  disabled = false,
  active = false,
  style,
  contentStyle,
}) => {
  const themeColors = useThemeColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  };

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
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: backgroundColor(),
            borderColor: borderColor(),
            opacity: disabled ? 0.6 : 1,
          },
          pressed && Platform.OS === "ios" && { opacity: 0.9 },
          contentStyle,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",

    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
