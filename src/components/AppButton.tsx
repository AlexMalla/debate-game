import React, { useRef } from "react";
import {
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Pressable,
  Platform,
  View,
} from "react-native";
import { Colors, Typography, Spacing } from "../constants/Colors";
import { useThemeColors } from "../hooks/useThemeColors";

interface AppButtonProps {
  title?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger" | "icon";
  icon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  icon,
  style,
  textStyle,
  disabled = false,
}) => {
  const themeColors = useThemeColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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

  const getBackgroundColor = () => {
    if (disabled) return themeColors.border;
    switch (variant) {
      case "secondary":
        return Colors.secondary;
      case "outline":
        return "transparent";
      case "danger":
        return Colors.danger;
      case "icon":
        return themeColors.card;
      default:
        return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return themeColors.subtext;
    if (variant === "outline") return Colors.primary;
    if (variant === "icon") return Colors.primary;
    return Colors.white;
  };

  const isIconButton = variant === "icon" || (!title && icon);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={({ pressed }) => {
          const baseStyles: ViewStyle[] = [styles.button];
          if (isIconButton) baseStyles.push(styles.iconButton);
          baseStyles.push({ backgroundColor: getBackgroundColor() });
          if (variant === "outline") {
            baseStyles.push({
              borderWidth: 2,
              borderColor: Colors.primary,
            });
          }
          if (pressed && Platform.OS === "ios") {
            baseStyles.push({ opacity: 0.8 });
          }
          return baseStyles;
        }}
      >
        {isIconButton ? (
          icon
        ) : (
          <>
            {icon && (
              <View style={title ? { marginRight: Spacing.sm } : null}>
                {icon}
              </View>
            )}
            {title && (
              <Text
                style={[
                  styles.text,
                  { color: getTextColor() },
                  Typography.button,
                  textStyle,
                ]}
              >
                {title.toUpperCase()}
              </Text>
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 32,
    paddingHorizontal: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  text: {
    fontWeight: "800",
    letterSpacing: 1,
  },
});
