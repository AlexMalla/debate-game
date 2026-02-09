import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useThemeColors } from '../hooks/useThemeColors';
import { useGameStore } from '../store/useGameStore';

interface ScreenLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children, style }) => {
  const themeColors = useThemeColors();
  const isDarkMode = useGameStore((state) => state.settings.isDarkMode);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={[styles.content, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
