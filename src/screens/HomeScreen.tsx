import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../components/ScreenLayout";
import { AppButton } from "../components/AppButton";
import { SettingsModal } from "../components/SettingsModal";
import { Colors, Typography, Spacing } from "../constants/Colors";
import { useThemeColors } from "../hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Setup: undefined;
  Rules: undefined;
  Credits: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const themeColors = useThemeColors();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScreenLayout style={styles.container}>
      <View style={styles.header}>
        <AppButton
          variant="icon"
          onPress={() => setIsSettingsVisible(true)}
          icon={
            <Ionicons
              name="settings-outline"
              size={24}
              color={Colors.primary}
            />
          }
        />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, Typography.h1, { color: Colors.primary }]}
          >
            Dibattito
          </Text>
          <View style={styles.badge}>
            <Text
              style={[
                styles.subtitle,
                Typography.caption,
                { color: Colors.white },
              ]}
            >
              IL PARTY GAME DEFINITIVO
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            title="GIOCA"
            onPress={() => navigation.navigate("Setup")}
            style={styles.playButton}
          />
          <AppButton
            title="REGOLE"
            onPress={() => navigation.navigate("Rules")}
            variant="secondary"
          />
          <AppButton
            title="CREDITI"
            onPress={() => navigation.navigate("Credits")}
            variant="outline"
          />
        </View>
      </Animated.View>

      <SettingsModal
        visible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  header: {
    alignItems: "flex-end",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  titleContainer: {
    marginBottom: Spacing.xxl,
    alignItems: "center",
  },
  title: {
    marginBottom: Spacing.xs,
  },
  badge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    marginTop: Spacing.xs,
  },
  subtitle: {
    fontWeight: "800",
    letterSpacing: 1,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  playButton: {
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.sm,
  },
});
