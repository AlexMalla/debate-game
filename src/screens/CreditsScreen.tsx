import React, { useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { ScreenLayout } from "../components/ScreenLayout";
import { Colors, Typography, Spacing } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "../hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { AppButton } from "../components/AppButton";

export const CreditsScreen = () => {
  const navigation = useNavigation();
  const themeColors = useThemeColors();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
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
    <ScreenLayout>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* ───────── HEADER ───────── */}
        <View style={styles.header}>
          <AppButton
            variant="icon"
            onPress={() => navigation.goBack()}
            icon={
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            }
          />

          <Text
            style={[
              Typography.h3,
              { color: themeColors.text, fontWeight: "800" },
            ]}
          >
            Crediti
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: Colors.primary + "15" },
              ]}
            >
              <Ionicons name="code-slash" size={32} color={Colors.primary} />
            </View>

            <Text
              style={[
                Typography.caption,
                {
                  color: themeColors.subtext,
                  letterSpacing: 2,
                  marginBottom: Spacing.xs,
                },
              ]}
            >
              SVILUPPATO DA
            </Text>
            <Text
              style={[
                Typography.h1,
                { color: themeColors.text, textAlign: "center" },
              ]}
            >
              Alex Mallamaci
            </Text>
            {/*            <Text
              style={[
                Typography.body,
                {
                  color: Colors.primary,
                  fontWeight: "700",
                  marginTop: Spacing.xs,
                },
              ]}
            >
              (Malla)
            </Text> */}

            <View style={styles.divider} />

            <Text
              style={[
                Typography.body,
                {
                  color: themeColors.subtext,
                  textAlign: "center",
                  lineHeight: 22,
                },
              ]}
            >
              Un gioco creato per accendere dibattiti, stimolare il pensiero
              critico e divertirsi in compagnia.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[Typography.caption, { color: themeColors.subtext }]}>
            v1.0.0 • 2026
          </Text>
        </View>
      </Animated.View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  backButton: {
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
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  card: {
    width: "100%",
    padding: Spacing.xl,
    borderRadius: 30,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  divider: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary + "30",
    marginVertical: Spacing.lg,
  },
  footer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
});
