import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { useThemeColors } from '../hooks/useThemeColors';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  style, 
  textStyle,
  disabled = false
}) => {
  const themeColors = useThemeColors();

  const getBackgroundColor = () => {
    if (disabled) return themeColors.border;
    switch (variant) {
      case 'secondary': return Colors.secondary;
      case 'outline': return 'transparent';
      case 'danger': return Colors.danger;
      default: return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return themeColors.subtext;
    if (variant === 'outline') return themeColors.text; // Use text color for outline in dark mode? Or primary?
    return Colors.white;
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
        // Outline button usually matches text color or primary color
        // If text is themeColors.text, border should match?
        // Original was Colors.primary.
        // Let's stick to Colors.primary for brand consistency, unless in dark mode it needs to be visible.
        // Colors.primary is #6C63FF which is visible on dark background.
        return Colors.primary;
    }
    return 'transparent';
  }

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && { 
            borderWidth: 2, 
            borderColor: getBorderColor(),
            shadowOpacity: 0,
            elevation: 0
        },
        style
      ]} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
