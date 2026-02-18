import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
  Animated,
} from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { Colors, Spacing, Typography } from "../constants/Colors";

interface AppTextInputProps extends TextInputProps {
  label?: string;
}

export const AppTextInput: React.FC<AppTextInputProps> = ({
  label,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const themeColors = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            Typography.caption,
            { color: isFocused ? Colors.primary : themeColors.subtext },
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: themeColors.card,
            borderColor: isFocused ? Colors.primary : themeColors.border,
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            Typography.body,
            {
              color: themeColors.text,
            },
            style,
          ]}
          placeholderTextColor={themeColors.subtext}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  label: {
    marginBottom: Spacing.xs,
    fontWeight: "600",
  },
  inputWrapper: {
    borderRadius: 16,
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
});
