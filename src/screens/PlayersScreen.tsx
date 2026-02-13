import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../components/ScreenLayout";
import { AppTextInput } from "../components/AppTextInput";
import { useGameStore } from "../store/useGameStore";
import { useThemeColors } from "../hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { AppTouchable } from "../components/AppTouachable";

export const PlayersScreen = () => {
  const navigation = useNavigation();
  const { players, addPlayer, removePlayer } = useGameStore();
  const themeColors = useThemeColors();
  const [playerName, setPlayerName] = useState("");

  const handleAddPlayer = () => {
    const name = playerName.trim();
    if (!name) return;

    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      Alert.alert("Errore", "Questo nome esiste già!");
      return;
    }

    addPlayer(name);
    setPlayerName("");
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
          Giocatori
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View style={{ flex: 1 }}>
                <AppTextInput
                  placeholder="Aggiungi giocatore"
                  value={playerName}
                  onChangeText={setPlayerName}
                  onSubmitEditing={handleAddPlayer}
                  maxLength={25}
                  style={{ width: "100%" }}
                />
              </View>

              <AppTouchable
                onPress={handleAddPlayer}
                style={{
                  backgroundColor: Colors.primary,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                }}
                disabled={!playerName.trim()}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </AppTouchable>
            </View>
          </View>

          {/* ───────── LISTA ───────── */}
          <View style={styles.section}>
            {players.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="people-outline"
                  size={48}
                  color={themeColors.subtext}
                />
                <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
                  Nessun giocatore aggiunto
                </Text>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {players.map((player) => (
                  <View
                    key={player.id}
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <View
                      style={[
                        styles.playerCard,
                        {
                          backgroundColor: themeColors.card,
                          flex: 1,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: themeColors.text,
                          fontSize: 16,
                          fontWeight: "500",
                        }}
                      >
                        {player.name}
                      </Text>
                    </View>

                    <AppTouchable
                      onPress={() => removePlayer(player.id)}
                      style={{
                        backgroundColor: Colors.danger,
                        borderRadius: 10,
                        borderColor: "transparent",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons name="trash-outline" size={20} color="#fff" />
                    </AppTouchable>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
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
    gap: 10,
  },
  playerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 20,
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
