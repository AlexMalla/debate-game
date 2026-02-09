import React from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
} from "react-native";
import { Colors } from "../constants/Colors";
import { useThemeColors } from "../hooks/useThemeColors";

interface AppTextInputProps extends TextInputProps {
  label?: string;
}

export const AppTextInput: React.FC<AppTextInputProps> = ({
  label,
  style,
  ...props
}) => {
  const themeColors = useThemeColors();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: themeColors.text }]}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeColors.card,
            borderColor: themeColors.border,
            color: themeColors.text,
          },
          style,
        ]}
        placeholderTextColor={themeColors.subtext}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
  },
});
