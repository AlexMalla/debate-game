import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../components/ScreenLayout";
import { AppButton } from "../components/AppButton";
import { AppTextInput } from "../components/AppTextInput";
import { useThemeColors } from "../hooks/useThemeColors";
import { Colors } from "../constants/Colors";
import { useGameStore } from "../store/useGameStore";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppTouchable } from "../components/AppTouachable";

type RootStackParamList = {
  Game: undefined;
  Players: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SetupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    players,
    addPlayer,
    removePlayer,
    settings,
    toggleFinalDiscussion,
    setGameMode,
    startGame,
    setRoundDuration,
    estimateGameDurationFormatted,
  } = useGameStore();

  const themeColors = useThemeColors();
  const [playerName, setPlayerName] = useState("");

  const isQuickMode = settings.gameMode === "quick";
  const isOddPlayers = players.length % 2 !== 0;
  const showQuickWarning = isQuickMode && isOddPlayers;

  useEffect(() => {
    if (settings.gameMode === "quick" && players.length < 4) {
      setGameMode("all_vs_all");
    }
  }, [players.length, settings.gameMode]);

  const handleAddPlayer = () => {
    if (!playerName.trim()) return;
    if (
      players.some(
        (p) => p.name.toLowerCase() === playerName.trim().toLowerCase(),
      )
    ) {
      Alert.alert("Errore", "Questo nome esiste già!");
      return;
    }
    addPlayer(playerName.trim());
    setPlayerName("");
  };

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
      {/* ───────── HEADER ───────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: Colors.primary }]}>
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
          {/* ───────── GIOCATORI ───────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Giocatori
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Players")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.playerCard,
                  {
                    backgroundColor: themeColors.card,
                    justifyContent: "space-between",
                  },
                ]}
              >
                <View>
                  <Text
                    style={{
                      color: themeColors.text,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {players.length}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={themeColors.subtext}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* ───────── MODALITÀ ───────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Modalità di gioco
            </Text>

            <View style={styles.gameModeContainer}>
              <AppTouchable
                active={settings.gameMode === "all_vs_all"}
                onPress={() => setGameMode("all_vs_all")}
              >
                <Text
                  style={[
                    styles.modeTitle,
                    { color: themeColors.text },
                    settings.gameMode === "all_vs_all" && {
                      color: Colors.white,
                    },
                  ]}
                >
                  Tutti contro tutti
                </Text>
                <Text
                  style={[
                    styles.modeDescription,
                    { color: themeColors.subtext },
                    settings.gameMode === "all_vs_all" && {
                      color: "rgba(255,255,255,0.8)",
                    },
                  ]}
                >
                  Ogni giocatore sfida tutti gli altri.
                </Text>
              </AppTouchable>

              <AppTouchable
                active={settings.gameMode === "quick"}
                disabled={players.length <= 3}
                onPress={() => setGameMode("quick")}
              >
                <View style={styles.quickHeader}>
                  <Text
                    style={[
                      styles.modeTitle,
                      { color: themeColors.text },
                      isQuickMode && { color: Colors.white },
                    ]}
                  >
                    Modalità rapida
                  </Text>

                  {showQuickWarning && (
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          "Attenzione",
                          "Modalità consigliata con numero PARI di giocatori.",
                        )
                      }
                    >
                      <View style={styles.warningBadge}>
                        <Ionicons
                          name="warning"
                          size={16}
                          color={Colors.white}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
                <Text
                  style={[
                    styles.modeDescription,
                    { color: themeColors.subtext },
                    settings.gameMode === "quick" && {
                      color: "rgba(255,255,255,0.8)",
                    },
                  ]}
                >
                  Ogni giocatore fa un solo dibattito.
                </Text>
                <Text
                  style={[
                    styles.modeDescription,
                    { color: themeColors.subtext },
                    settings.gameMode === "quick" && {
                      color: "rgba(255,255,255,0.8)",
                    },
                  ]}
                >
                  {" "}
                  (Minimo 4 giocatori)
                </Text>
              </AppTouchable>
            </View>
          </View>

          {/* ───────── ALTRE IMPOSTAZIONI ───────── */}
          <View
            style={[
              styles.section,
              { display: "flex", flexDirection: "column", gap: 32 },
            ]}
          >
            <View>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: themeColors.text, marginBottom: 8 },
                ]}
              >
                Durata round
              </Text>

              <View style={{ flexDirection: "row", gap: 10 }}>
                {[30, 60, 120].map((duration) => {
                  const isActive = settings.roundDuration === duration;

                  return (
                    <TouchableOpacity
                      key={duration}
                      onPress={() =>
                        setRoundDuration(duration as 30 | 60 | 120)
                      }
                      style={[
                        styles.durationButton,
                        {
                          borderColor: isActive
                            ? Colors.primary
                            : themeColors.border,
                          backgroundColor: isActive
                            ? Colors.primary
                            : "transparent",
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: isActive ? Colors.white : themeColors.text,
                          fontWeight: "600",
                        }}
                      >
                        {duration === 30
                          ? "30s"
                          : duration === 60
                            ? "1 min"
                            : "2 min"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={[styles.switchRow, { alignItems: "center" }]}>
              <Text
                style={[styles.sectionSubtitle, { color: themeColors.text }]}
              >
                Rimuovi discussione finale
              </Text>

              <Switch
                value={settings.removeFinalDiscussion}
                onValueChange={toggleFinalDiscussion}
                trackColor={{
                  false: themeColors.border,
                  true: Colors.primary,
                }}
                thumbColor={Colors.white}
              />
            </View>
          </View>
        </ScrollView>

        {/* ───────── FOOTER ───────── */}
        <View style={styles.footer}>
          <AppButton
            title="INIZIA PARTITA"
            onPress={handleStartGame}
            disabled={players.length < 3}
            variant="primary"
          />

          {players.length >= 3 && (
            <View style={styles.durationRow}>
              <Text
                style={[styles.sectionSubtitle, { color: themeColors.text }]}
              >
                Durata stimata partita:
              </Text>
              <Text style={{ color: themeColors.subtext, fontSize: 16 }}>
                {estimateGameDurationFormatted()}
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  playerName: {
    fontSize: 16,
  },
  playerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
  gameModeContainer: {
    gap: 12,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modeDescription: {
    fontSize: 14,
  },
  quickHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  warningBadge: {
    backgroundColor: Colors.warning ?? "#F59E0B",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    paddingTop: 10,
  },
  durationRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
