import React, { useState } from "react";
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

type RootStackParamList = {
  Game: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SetupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    players,
    addPlayer,
    removePlayer,
    settings,
    setWinningScore,
    startGame,
    toggleTheme,
  } = useGameStore();
  const themeColors = useThemeColors();
  const [playerName, setPlayerName] = useState("");

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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: Colors.primary }]}>
            Configurazione
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Aggiungi Giocatori ({players.length})
            </Text>
            <View style={styles.inputContainer}>
              <AppTextInput
                placeholder="Nome giocatore"
                value={playerName}
                onChangeText={setPlayerName}
                onSubmitEditing={handleAddPlayer}
                style={{ flex: 1 }}
              />
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: Colors.primary }]}
                onPress={handleAddPlayer}
              >
                <Ionicons name="add" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <View
              style={[styles.playerList, { backgroundColor: themeColors.card }]}
            >
              {players.map((player) => (
                <View
                  key={player.id}
                  style={[
                    styles.playerItem,
                    { borderBottomColor: themeColors.border },
                  ]}
                >
                  <Text
                    style={[styles.playerName, { color: themeColors.text }]}
                  >
                    {player.name}
                  </Text>
                  <TouchableOpacity onPress={() => removePlayer(player.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={Colors.danger}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              {players.length === 0 && (
                <Text
                  style={[styles.emptyText, { color: themeColors.subtext }]}
                >
                  Nessun giocatore aggiunto
                </Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Punteggio Vittoria
            </Text>
            <View style={styles.scoreContainer}>
              {[3, 5, 10].map((score) => (
                <TouchableOpacity
                  key={score}
                  style={[
                    styles.scoreButton,
                    {
                      borderColor: themeColors.border,
                      backgroundColor: themeColors.card,
                    },
                    settings.winningScore === score && {
                      backgroundColor: Colors.primary,
                      borderColor: Colors.primary,
                    },
                  ]}
                  onPress={() => setWinningScore(score as 3 | 5 | 10)}
                >
                  <Text
                    style={[
                      styles.scoreText,
                      { color: themeColors.text },
                      settings.winningScore === score && {
                        color: Colors.white,
                      },
                    ]}
                  >
                    {score}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.switchRow}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: themeColors.text, marginBottom: 0 },
                ]}
              >
                Tema Scuro
              </Text>
              <Switch
                value={settings.isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: themeColors.border, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
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
  scrollContent: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8, // align with input
  },
  playerList: {
    borderRadius: 12,
    padding: 10,
  },
  playerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  playerName: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
  scoreContainer: {
    flexDirection: "row",
    gap: 15,
  },
  scoreButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
  },
  scoreButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: "#F0EEFF",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreTextActive: {
    color: Colors.primary,
  },
  footer: {
    paddingTop: 10,
  },
  header: {
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent", // Will be handled by theme in render
    borderRadius: 12,
  },
});
