import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../components/ScreenLayout";
import { AppTextInput } from "../components/AppTextInput";
import { AppButton } from "../components/AppButton";
import { useGameStore } from "../store/useGameStore";
import { useThemeColors } from "../hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing } from "../constants/Colors";

export const PlayersScreen = () => {
  const navigation = useNavigation();
  const { players, addPlayer, removePlayer } = useGameStore();
  const themeColors = useThemeColors();
  const [playerName, setPlayerName] = useState("");

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
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
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
            Giocatori
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.inputSection}>
              <View style={styles.inputRow}>
                <View style={{ flex: 1 }}>
                  <AppTextInput
                    placeholder="Aggiungi giocatore"
                    value={playerName}
                    onChangeText={setPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    maxLength={25}
                  />
                </View>

                <AppButton
                  onPress={handleAddPlayer}
                  disabled={!playerName.trim()}
                  icon={<Ionicons name="add" size={28} color={Colors.white} />}
                  style={styles.addButton}
                  variant="primary"
                />
              </View>
            </View>

            {/* ───────── LISTA ───────── */}
            <View style={styles.listSection}>
              {players.length === 0 ? (
                <View style={styles.emptyState}>
                  <View
                    style={[
                      styles.emptyIconContainer,
                      { backgroundColor: themeColors.card },
                    ]}
                  >
                    <Ionicons
                      name="people-outline"
                      size={48}
                      color={themeColors.subtext}
                    />
                  </View>
                  <Text style={[Typography.h3, { color: themeColors.text }]}>
                    Nessun giocatore
                  </Text>
                  <Text
                    style={[
                      Typography.body,
                      { color: themeColors.subtext, textAlign: "center" },
                    ]}
                  >
                    Aggiungi almeno 3 giocatori per iniziare a giocare.
                  </Text>
                </View>
              ) : (
                <View>
                  {players.map((player) => (
                    <View key={player.id} style={styles.playerRow}>
                      <View
                        style={[
                          styles.playerCard,
                          { backgroundColor: themeColors.card },
                        ]}
                      >
                        <Text
                          style={[
                            Typography.body,
                            { color: themeColors.text, fontWeight: "600" },
                          ]}
                        >
                          {player.name}
                        </Text>
                      </View>

                      <AppButton
                        onPress={() => removePlayer(player.id)}
                        variant="danger"
                        icon={
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color={Colors.white}
                          />
                        }
                        style={styles.deleteButton}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  headerSpacer: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  inputSection: {
    marginBottom: Spacing.xl,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  addButton: {},
  listSection: {
    flex: 1,
  },
  playerRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  playerCard: {
    flex: 1,
    height: 56,
    paddingHorizontal: Spacing.lg,
    borderRadius: 18,
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  deleteButton: {},
  emptyState: {
    alignItems: "center",
    marginTop: Spacing.xxl,
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
});
