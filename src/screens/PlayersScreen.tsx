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
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

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

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => removePlayer(id)}
    >
      <Ionicons name="trash-outline" size={22} color={Colors.white} />
    </TouchableOpacity>
  );

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
          {/* ───────── INPUT ───────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Aggiungi giocatore
            </Text>

            <View style={styles.inputContainer}>
              <AppTextInput
                placeholder="Nome giocatore"
                value={playerName}
                onChangeText={setPlayerName}
                onSubmitEditing={handleAddPlayer}
                maxLength={25}
                style={{ flex: 1 }}
              />
            </View>
          </View>

          {/* ───────── LISTA ───────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Giocatori ({players.length})
            </Text>

            {players.length === 0 ? (
              <Text style={[styles.emptyText, { color: themeColors.subtext }]}>
                Nessun giocatore aggiunto
              </Text>
            ) : (
              <View style={{ gap: 10 }}>
                {players.map((player) => (
                  <ReanimatedSwipeable
                    key={player.id}
                    renderRightActions={() => renderRightActions(player.id)}
                    rightThreshold={80}
                    overshootRight={false}
                    onSwipeableOpen={(direction) => {
                      if (direction === "right") {
                        removePlayer(player.id);
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.playerCard,
                        { backgroundColor: themeColors.card },
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
                  </ReanimatedSwipeable>
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  deleteAction: {
    backgroundColor: Colors.danger,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 14,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 20,
    fontStyle: "italic",
  },
});
