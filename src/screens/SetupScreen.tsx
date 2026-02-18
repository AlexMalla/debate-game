import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../components/ScreenLayout";
import { AppButton } from "../components/AppButton";
import { useThemeColors } from "../hooks/useThemeColors";
import { Colors, Spacing, Typography } from "../constants/Colors";
import { useGameStore } from "../store/useGameStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppTouchable } from "../components/AppTouchable";

type RootStackParamList = {
  Game: undefined;
  Players: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SetupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    players,
    settings,
    toggleFinalDiscussion,
    setGameMode,
    startGame,
    setRoundDuration,
    estimateGameDurationFormatted,
  } = useGameStore();

  const themeColors = useThemeColors();

  const isQuickMode = settings.gameMode === "quick";
  const isOddPlayers = players.length % 2 !== 0;
  const showQuickWarning = isOddPlayers;

  const handleQuickWarning = () => {
    Alert.alert(
      "Giocatori dispari",
      "La modalità rapida è ottimizzata per un numero pari di giocatori. In caso di numero dispari, alcuni giocatori potrebbero avere un numero diverso di dibattiti.",
      [{ text: "Ho capito", style: "default" }],
    );
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (settings.gameMode === "quick" && players.length < 4) {
      setGameMode("all_vs_all");
    }
  }, [players.length, settings.gameMode]);

  const handleStartGame = () => {
    if (players.length < 3) {
      Alert.alert("Attenzione", "Servono almeno 3 giocatori per iniziare.");
      return;
    }

    startGame();
    navigation.replace("Game");
  };

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <AppButton
          variant="icon"
          onPress={() => navigation.goBack()}
          icon={<Ionicons name="arrow-back" size={24} color={Colors.primary} />}
        />
        <Text
          style={[
            styles.headerTitle,
            Typography.h3,
            { color: themeColors.text },
          ]}
        >
          Configurazione
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* GIOCATORI */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  Typography.h3,
                  { color: themeColors.text },
                ]}
              >
                Giocatori
              </Text>
              <AppTouchable
                onPress={() => navigation.navigate("Players")}
                style={styles.playerCard}
                contentStyle={styles.playerCardContent}
              >
                <View style={styles.playerInfo}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: Colors.primary + "20" },
                    ]}
                  >
                    <Ionicons name="people" size={24} color={Colors.primary} />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.playerCount,
                        Typography.h2,
                        { color: themeColors.text },
                      ]}
                    >
                      {players.length}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={themeColors.subtext}
                />
              </AppTouchable>
            </View>

            {/* MODALITÀ */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  Typography.h3,
                  { color: themeColors.text },
                ]}
              >
                Modalità di gioco
              </Text>
              <View style={styles.gameModeContainer}>
                <AppTouchable
                  active={settings.gameMode === "all_vs_all"}
                  onPress={() => setGameMode("all_vs_all")}
                  style={styles.modeCard}
                  contentStyle={styles.modeCardContent}
                >
                  <View style={styles.modeHeader}>
                    <MaterialCommunityIcons
                      name="sword-cross"
                      size={24}
                      color={
                        settings.gameMode === "all_vs_all"
                          ? Colors.white
                          : Colors.primary
                      }
                    />
                    <Text
                      style={[
                        styles.modeTitle,
                        Typography.h3,
                        {
                          color:
                            settings.gameMode === "all_vs_all"
                              ? Colors.white
                              : themeColors.text,
                        },
                      ]}
                    >
                      Tutti contro tutti
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.modeDesc,
                      Typography.caption,
                      {
                        color:
                          settings.gameMode === "all_vs_all"
                            ? "rgba(255,255,255,0.8)"
                            : themeColors.subtext,
                      },
                    ]}
                  >
                    Ogni giocatore sfida tutti gli altri.
                  </Text>
                </AppTouchable>

                <AppTouchable
                  active={settings.gameMode === "quick"}
                  disabled={players.length < 4}
                  onPress={() => setGameMode("quick")}
                  style={styles.modeCard}
                  contentStyle={styles.modeCardContent}
                >
                  <View style={styles.modeHeader}>
                    <Ionicons
                      name="flash"
                      size={24}
                      color={isQuickMode ? Colors.white : Colors.primary}
                    />
                    <Text
                      style={[
                        styles.modeTitle,
                        Typography.h3,
                        {
                          color: isQuickMode ? Colors.white : themeColors.text,
                        },
                      ]}
                    >
                      Modalità rapida
                    </Text>
                    {showQuickWarning && (
                      <AppTouchable
                        onPress={handleQuickWarning}
                        style={styles.warningIcon}
                        contentStyle={{
                          backgroundColor: "transparent",
                          borderWidth: 0,
                        }}
                      >
                        <Ionicons
                          name="warning"
                          size={20}
                          color={isQuickMode ? Colors.white : Colors.warning}
                        />
                      </AppTouchable>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.modeDesc,
                      Typography.caption,
                      {
                        color: isQuickMode
                          ? "rgba(255,255,255,0.8)"
                          : themeColors.subtext,
                      },
                    ]}
                  >
                    Ogni giocatore partecipa a un solo dibattito.
                  </Text>
                  {players.length < 4 && (
                    <Text style={[styles.minPlayers, { color: Colors.danger }]}>
                      (Minimo 4 giocatori)
                    </Text>
                  )}
                </AppTouchable>
              </View>
            </View>

            {/* DURATA ROUND */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  Typography.h3,
                  { color: themeColors.text },
                ]}
              >
                Durata round
              </Text>
              <View style={styles.durationGrid}>
                {[30, 60, 120].map((duration) => {
                  const isActive = settings.roundDuration === duration;
                  return (
                    <AppTouchable
                      key={duration}
                      onPress={() =>
                        setRoundDuration(duration as 30 | 60 | 120)
                      }
                      active={isActive}
                      style={styles.durationButton}
                      contentStyle={styles.durationButtonContent}
                    >
                      <Text
                        style={[
                          styles.durationText,
                          Typography.button,
                          { color: isActive ? Colors.white : themeColors.text },
                        ]}
                      >
                        {duration === 30
                          ? "30s"
                          : duration === 60
                            ? "1 min"
                            : "2 min"}
                      </Text>
                    </AppTouchable>
                  );
                })}
              </View>
            </View>

            {/* ALTRE IMPOSTAZIONI */}
            <View style={styles.section}>
              <View
                style={[
                  styles.switchRow,
                  { backgroundColor: themeColors.card },
                ]}
              >
                <View style={styles.switchLabel}>
                  <Ionicons
                    name="chatbubbles-outline"
                    size={22}
                    color={Colors.primary}
                  />
                  <Text
                    style={[
                      Typography.body,
                      { color: themeColors.text, fontWeight: "600" },
                    ]}
                  >
                    Discussione finale
                  </Text>
                </View>
                <Switch
                  value={!settings.removeFinalDiscussion}
                  onValueChange={(val) => toggleFinalDiscussion()}
                  trackColor={{
                    false: themeColors.border,
                    true: Colors.primary,
                  }}
                  thumbColor={Colors.white}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* FOOTER */}
        <View
          style={[styles.footer, { backgroundColor: themeColors.background }]}
        >
          {players.length >= 3 && (
            <View style={styles.timeEstimate}>
              <Ionicons
                name="time-outline"
                size={18}
                color={themeColors.subtext}
              />
              <Text
                style={[Typography.caption, { color: themeColors.subtext }]}
              >
                Durata stimata:{" "}
                <Text style={{ color: Colors.primary, fontWeight: "700" }}>
                  {estimateGameDurationFormatted()}
                </Text>
              </Text>
            </View>
          )}
          <AppButton
            title="INIZIA PARTITA"
            onPress={handleStartGame}
            disabled={players.length < 3}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontWeight: "800",
  },
  headerSpacer: {
    width: 44,
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
  scrollContent: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  playerCard: {
    width: "100%",
  },
  playerCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  playerCount: {
    lineHeight: 32,
  },
  gameModeContainer: {
    gap: Spacing.md,
  },
  modeCard: {
    width: "100%",
  },
  modeCardContent: {
    alignItems: "center",
    padding: Spacing.md,
  },
  modeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  modeTitle: {
    fontWeight: "bold",
  },
  modeDesc: {
    lineHeight: 18,
  },
  minPlayers: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  warningIcon: {
    padding: 4,
  },
  durationGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    width: "100%",
  },

  durationButton: {
    flex: 1,
    height: 56,
  },
  durationButtonContent: {
    padding: Spacing.sm,
  },
  durationText: {
    fontWeight: "700",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 34 : Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    gap: Spacing.md,
  },
  timeEstimate: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
});
