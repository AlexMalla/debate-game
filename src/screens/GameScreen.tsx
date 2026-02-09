import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../components/ScreenLayout";
import { AppButton } from "../components/AppButton";
import { Colors } from "../constants/Colors";
import { useThemeColors } from "../hooks/useThemeColors";
import { useGameStore } from "../store/useGameStore";
import { GamePhase } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Victory: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PHASE_DURATION = 60; // seconds

export const GameScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const themeColors = useThemeColors();
  const {
    phase,
    roundData,
    players,
    nextPhase,
    submitVotes,
    startRound,
    winnerId,
    roundNumber,
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState(PHASE_DURATION);
  const [timerStatus, setTimerStatus] = useState<
    "IDLE" | "RUNNING" | "PAUSED" | "FINISHED"
  >("IDLE");
  const [votes, setVotes] = useState<Record<string, string>>({}); // judgeId -> winnerId
  const [isLeaderboardVisible, setLeaderboardVisible] = useState(false);

  // Animation for timer
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Effect to handle navigation to Victory
  useEffect(() => {
    if (phase === "GAME_OVER" || winnerId) {
      navigation.replace("Victory");
    }
  }, [phase, winnerId]);

  // Reset timer on phase change
  useEffect(() => {
    if (["DEFENSE", "OFFENSE", "DISCUSSION"].includes(phase)) {
      setTimeLeft(PHASE_DURATION);
      setTimerStatus("IDLE");
    }
  }, [phase]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerStatus === "RUNNING") {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerStatus("FINISHED");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerStatus]);

  const toggleTimer = () => {
    if (timerStatus === "IDLE" || timerStatus === "PAUSED") {
      setTimerStatus("RUNNING");
    } else if (timerStatus === "RUNNING") {
      setTimerStatus("PAUSED");
    }
  };

  // Helper to get player name
  const getPlayerName = (id: string) =>
    players.find((p) => p.id === id)?.name || "Unknown";

  const handleVote = (judgeId: string, votedId: string) => {
    setVotes((prev) => ({ ...prev, [judgeId]: votedId }));
  };

  const confirmVotes = () => {
    // Ensure all judges voted
    if (roundData && Object.keys(votes).length < roundData.judgeIds.length) {
      // Optional: Alert user
      return;
    }
    submitVotes(votes);
    setVotes({});
  };

  const toggleLeaderboard = () => {
    if (!isLeaderboardVisible) {
      if (timerStatus === "RUNNING") {
        setTimerStatus("PAUSED");
      }
      setLeaderboardVisible(true);
    } else {
      setLeaderboardVisible(false);
    }
  };

  const handleExitGame = () => {
    Alert.alert(
      "Uscire dalla partita?",
      "Se esci ora, la partita verrà terminata e tornerai alla schermata principale.",
      [
        {
          text: "Annulla",
          style: "cancel",
        },
        {
          text: "Esci",
          style: "destructive",
          onPress: () => {
            navigation.navigate("Home");
          },
        },
      ],
    );
  };

  if (!roundData) return null;

  const defenderName = getPlayerName(roundData.defenderId);
  const opponentName = getPlayerName(roundData.opponentId);

  const renderPhaseContent = () => {
    switch (phase) {
      case "DEFENSE":
        return (
          <View style={styles.phaseContainer}>
            <Text style={styles.phaseTitle}>Difesa della tesi</Text>
            <Text style={[styles.activePlayer, { color: themeColors.text }]}>
              {defenderName}
            </Text>
            <Text style={[styles.instruction, { color: themeColors.subtext }]}>
              Argomenta a favore!
            </Text>
          </View>
        );
      case "OFFENSE":
        return (
          <View style={styles.phaseContainer}>
            <Text style={styles.phaseTitle}>Antitesi</Text>
            <Text style={[styles.activePlayer, { color: themeColors.text }]}>
              {opponentName}
            </Text>
            <Text style={[styles.instruction, { color: themeColors.subtext }]}>
              Argomenta contro!
            </Text>
          </View>
        );
      case "DISCUSSION":
        return (
          <View style={styles.phaseContainer}>
            <Text style={styles.phaseTitle}>Discussione libera</Text>
            <View style={styles.versusContainer}>
              <Text style={[styles.activePlayer, { color: themeColors.text }]}>
                {defenderName}
              </Text>
              <Text style={styles.versus}>VS</Text>
              <Text style={[styles.activePlayer, { color: themeColors.text }]}>
                {opponentName}
              </Text>
            </View>
          </View>
        );
      case "VOTING":
        return (
          <View style={styles.votingContainer}>
            <Text style={styles.phaseTitle}>Votazione</Text>
            <Text style={[styles.instruction, { color: themeColors.subtext }]}>
              Giudici, chi vi ha convinto?
            </Text>

            <ScrollView style={styles.judgesList}>
              {roundData.judgeIds.map((judgeId) => (
                <View
                  key={judgeId}
                  style={[
                    styles.voteCard,
                    { backgroundColor: themeColors.card },
                  ]}
                >
                  <Text style={[styles.judgeName, { color: themeColors.text }]}>
                    {getPlayerName(judgeId)} vota per:
                  </Text>
                  <View style={styles.voteButtons}>
                    <AppButton
                      title={defenderName}
                      onPress={() => handleVote(judgeId, roundData.defenderId)}
                      variant={
                        votes[judgeId] === roundData.defenderId
                          ? "primary"
                          : "outline"
                      }
                      style={styles.voteBtn}
                    />
                    <AppButton
                      title={opponentName}
                      onPress={() => handleVote(judgeId, roundData.opponentId)}
                      variant={
                        votes[judgeId] === roundData.opponentId
                          ? "secondary"
                          : "outline"
                      }
                      style={styles.voteBtn}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>

            <AppButton
              title="CONFERMA VOTI"
              onPress={confirmVotes}
              disabled={Object.keys(votes).length < roundData.judgeIds.length}
            />
          </View>
        );
      case "ROUND_END":
        return (
          <View style={styles.roundEndContainer}>
            <Text style={styles.phaseTitle}>Fine Turno</Text>
            <View
              style={[
                styles.scoresContainer,
                { backgroundColor: themeColors.card },
              ]}
            >
              <Text style={[styles.sectionHeader, { color: themeColors.text }]}>
                Classifica Attuale
              </Text>
              {players
                .sort((a, b) => b.score - a.score)
                .map((p) => (
                  <View
                    key={p.id}
                    style={[
                      styles.scoreRow,
                      { borderBottomColor: themeColors.border },
                    ]}
                  >
                    <Text
                      style={[styles.scoreName, { color: themeColors.text }]}
                    >
                      {p.name}
                    </Text>
                    <Text style={styles.scoreValue}>{p.score}</Text>
                  </View>
                ))}
            </View>
            <AppButton title="PROSSIMO ROUND" onPress={startRound} />
          </View>
        );
      default:
        return null;
    }
  };

  const isTimerPhase = ["DEFENSE", "OFFENSE", "DISCUSSION"].includes(phase);

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExitGame} style={styles.backButton}>
          <Ionicons name="close" size={24} color={Colors.primary} />
        </TouchableOpacity>
        {/*     <Text style={styles.headerTitle}>Dibattito in corso</Text> */}
        <View style={styles.roundInfo}>
          {phase !== "ROUND_END" && phase !== "VOTING" && (
            <TouchableOpacity onPress={nextPhase} style={styles.skipButton}>
              <Text style={[styles.skipText, { color: themeColors.subtext }]}>
                Salta
              </Text>
              <Ionicons
                name="play-forward"
                size={16}
                color={themeColors.subtext}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View
        style={[styles.thesisContainer, { backgroundColor: themeColors.card }]}
      >
        <Text style={styles.thesisLabel}>TESI:</Text>
        <Text style={[styles.thesisText, { color: themeColors.text }]}>
          {roundData.thesis}
        </Text>
      </View>

      {isTimerPhase && (
        <View style={styles.timerContainer}>
          <Text
            style={[
              styles.timer,
              { color: themeColors.text },
              timeLeft <= 10 && styles.timerUrgent,
            ]}
          >
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </Text>

          <View style={styles.timerControls}>
            {timerStatus === "FINISHED" ? (
              <AppButton
                title="PROSSIMA FASE"
                onPress={nextPhase}
                style={styles.controlButton}
              />
            ) : (
              <AppButton
                title={
                  timerStatus === "RUNNING"
                    ? "PAUSA"
                    : timerStatus === "IDLE"
                      ? "AVVIA"
                      : "RIPRENDI"
                }
                onPress={toggleTimer}
                variant={timerStatus === "RUNNING" ? "secondary" : "primary"}
                style={styles.controlButton}
              />
            )}
          </View>
        </View>
      )}

      <View style={styles.content}>{renderPhaseContent()}</View>

      {roundNumber >= 2 && phase !== "ROUND_END" && phase !== "VOTING" && (
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={toggleLeaderboard}
            style={styles.footerButton}
          >
            <Ionicons name="podium" size={20} color={Colors.white} />
            <Text style={styles.footerButtonText}>Classifica</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isLeaderboardVisible}
        onRequestClose={() => setLeaderboardVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              Classifica
            </Text>
            <ScrollView style={styles.modalList}>
              {players
                .sort((a, b) => b.score - a.score)
                .map((p, index) => (
                  <View
                    key={p.id}
                    style={[
                      styles.scoreRow,
                      { borderBottomColor: themeColors.border },
                    ]}
                  >
                    <Text style={styles.scoreRank}>#{index + 1}</Text>
                    <Text
                      style={[styles.scoreName, { color: themeColors.text }]}
                    >
                      {p.name}
                    </Text>
                    <Text style={styles.scoreValue}>{p.score}</Text>
                  </View>
                ))}
            </ScrollView>
            <AppButton
              title="CHIUDI"
              onPress={() => setLeaderboardVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  roundInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginRight: 10,
    padding: 5,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 5,
  },
  skipText: {
    fontSize: 12,
  },
  thesisContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  thesisLabel: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "bold",
    marginBottom: 5,
  },
  thesisText: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  timer: {
    fontSize: 64,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  timerControls: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    width: "100%",
    paddingHorizontal: 40,
  },
  controlButton: {
    flex: 1,
  },
  timerUrgent: {
    color: Colors.danger,
  },
  content: {
    flex: 1,
  },
  phaseContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  activePlayer: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  instruction: {
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
  },
  versusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 20,
  },
  versus: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.danger,
    fontStyle: "italic",
  },
  votingContainer: {
    flex: 1,
  },
  judgesList: {
    flex: 1,
    marginVertical: 20,
  },
  voteCard: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
  },
  judgeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  voteButtons: {
    flexDirection: "row",
    gap: 10,
  },
  voteBtn: {
    flex: 1,
    marginVertical: 0,
    paddingVertical: 10,
  },
  roundEndContainer: {
    flex: 1,
    width: "100%",
  },
  scoresContainer: {
    flex: 1,
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  scoreName: {
    fontSize: 16,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalList: {
    marginBottom: 20,
  },
  scoreRank: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: "bold",
    width: 40,
  },
  footer: {
    paddingVertical: 10,
    alignItems: "center",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 8,
  },
  footerButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
});
