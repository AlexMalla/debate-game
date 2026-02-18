import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../components/ScreenLayout";
import { AppButton } from "../components/AppButton";
import { Colors, Typography, Spacing } from "../constants/Colors";
import { useThemeColors } from "../hooks/useThemeColors";
import { useGameStore } from "../store/useGameStore";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const VictoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { winnerIds, players, resetGame } = useGameStore();
  const themeColors = useThemeColors();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const trophyScaleAnim = useRef(new Animated.Value(0)).current;

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
      Animated.spring(trophyScaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const winners = (winnerIds || [])
    .map((id) => players.find((p) => p.id === id))
    .filter(Boolean) as typeof players;

  const handleRestart = () => {
    resetGame();
    navigation.replace("Home");
  };

  const isDraw = winnerIds && winnerIds.length === players.length;

  return (
    <ScreenLayout>
      <View style={styles.topHeader}>
        <AppButton
          variant="icon"
          onPress={handleRestart}
          icon={<Ionicons name="close" size={24} color={Colors.danger} />}
        />
        <Text
          style={[
            Typography.h3,
            { color: themeColors.text, fontWeight: "800" },
          ]}
        >
          Risultati
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.header}>
          <Animated.View style={{ transform: [{ scale: trophyScaleAnim }] }}>
            <View
              style={[
                styles.trophyContainer,
                { backgroundColor: Colors.warning + "15" },
              ]}
            >
              <Ionicons name="trophy" size={80} color={Colors.warning} />
            </View>
          </Animated.View>

          <Text
            style={[
              Typography.h1,
              { color: Colors.primary, marginTop: Spacing.md },
            ]}
          >
            {isDraw ? "Pareggio!" : "Vittoria!"}
          </Text>

          {!isDraw && winners.length > 0 && (
            <View style={styles.winnersContainer}>
              {winners.map((w, index) => (
                <Text
                  key={w.id}
                  style={[
                    Typography.h1,
                    {
                      color: themeColors.text,
                      fontSize: winners.length > 1 ? 32 : 48,
                      textAlign: "center",
                    },
                  ]}
                >
                  {w.name}
                  {index < winners.length - 1 ? " & " : ""}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View
          style={[
            styles.leaderboardCard,
            { backgroundColor: themeColors.card },
          ]}
        >
          <Text
            style={[
              Typography.h3,
              {
                color: themeColors.text,
                marginBottom: Spacing.md,
                textAlign: "center",
              },
            ]}
          >
            Classifica Finale
          </Text>
          <ScrollView
            style={styles.leaderboardScroll}
            showsVerticalScrollIndicator={false}
          >
            {players
              .slice()
              .sort((a, b) => b.score - a.score)
              .map((p, index) => {
                const isWinner = winnerIds?.includes(p.id);
                return (
                  <View
                    key={p.id}
                    style={[
                      styles.leaderboardRow,
                      { borderBottomColor: themeColors.border },
                    ]}
                  >
                    <View style={styles.rankBadge}>
                      <Text
                        style={[
                          Typography.body,
                          {
                            color: isWinner ? Colors.warning : Colors.primary,
                            fontWeight: "800",
                          },
                        ]}
                      >
                        #{index + 1}
                      </Text>
                    </View>
                    <Text
                      style={[
                        Typography.body,
                        {
                          flex: 1,
                          color: themeColors.text,
                          fontWeight: isWinner ? "700" : "400",
                        },
                      ]}
                    >
                      {p.name}
                    </Text>
                    <View style={styles.scoreBadge}>
                      <Text
                        style={[
                          Typography.body,
                          { color: Colors.white, fontWeight: "800" },
                        ]}
                      >
                        {p.score}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <AppButton
            title="TORNA ALLA HOME"
            onPress={handleRestart}
            style={styles.homeButton}
          />
        </View>
      </Animated.View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerSpacer: {
    width: 44,
  },
  header: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  trophyContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.warning,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  winnersContainer: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  leaderboardCard: {
    flex: 1,
    borderRadius: 30,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  leaderboardScroll: {
    flex: 1,
  },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  rankBadge: {
    width: 40,
  },
  scoreBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 36,
    alignItems: "center",
  },
  footer: {
    paddingBottom: Spacing.lg,
  },
  homeButton: {
    width: "100%",
  },
});
