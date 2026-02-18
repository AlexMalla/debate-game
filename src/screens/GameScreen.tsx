import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  Modal,
  Platform,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../components/ScreenLayout";
import { AppButton } from "../components/AppButton";
import { AppTouchable } from "../components/AppTouchable";
import { Colors, Spacing, Typography } from "../constants/Colors";
import { useThemeColors } from "../hooks/useThemeColors";
import { useGameStore } from "../store/useGameStore";
import { GamePhase } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { useSound } from "../hooks/useSound";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Victory: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const GameScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const themeColors = useThemeColors();
  const { play } = useSound();
  const {
    phase,
    roundData,
    players,
    nextPhase,
    submitVotes,
    startRound,
    winnerIds,
    roundNumber,
    settings,
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState(settings.roundDuration);
  const [timerStatus, setTimerStatus] = useState<
    "IDLE" | "RUNNING" | "PAUSED" | "FINISHED"
  >("IDLE");
  const [votes, setVotes] = useState<Record<string, string>>({}); // judgeId -> winnerId
  const [isLeaderboardVisible, setLeaderboardVisible] = useState(false);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  // Animations
  const phaseFadeAnim = useRef(new Animated.Value(0)).current;
  const phaseSlideAnim = useRef(new Animated.Value(20)).current;
  const timerScaleAnim = useRef(new Animated.Value(1)).current;

  const animatePhase = () => {
    phaseFadeAnim.setValue(0);
    phaseSlideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(phaseFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(phaseSlideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  };

  useEffect(() => {
    animatePhase();
  }, [phase]);

  // Effect to handle navigation to Victory
  useEffect(() => {
    if (phase === "GAME_OVER") {
      navigation.replace("Victory");
    }
  }, [phase]);

  // Reset timer on phase change
  useEffect(() => {
    if (["DEFENSE", "OFFENSE", "DISCUSSION"].includes(phase)) {
      setTimeLeft(settings.roundDuration);
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
            play("end");
            return 0;
          }
          if (prev <= 10) {
            // Pulse animation for last 10 seconds
            Animated.sequence([
              Animated.timing(timerScaleAnim, {
                toValue: 1.1,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(timerScaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
            ]).start();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerStatus, play]);

  const toggleTimer = () => {
    if (timerStatus === "IDLE" || timerStatus === "PAUSED") {
      setTimerStatus("RUNNING");
      play("start");
    } else if (timerStatus === "RUNNING") {
      setTimerStatus("PAUSED");
      play("pause");
    }
  };

  const getPlayerName = (id: string) =>
    players.find((p) => p.id === id)?.name || "Unknown";

  const handleVote = (judgeId: string, votedId: string) => {
    setVotes((prev) => ({ ...prev, [judgeId]: votedId }));
    play("vote");
  };

  const confirmVotes = () => {
    if (roundData && Object.keys(votes).length < roundData.judgeIds.length) {
      return;
    }
    submitVotes(votes);
    setVotes({});
    play("click");
  };

  const toggleLeaderboard = () => {
    if (!isLeaderboardVisible) {
      if (timerStatus === "RUNNING") {
        setTimerStatus("PAUSED");
      }
      setLeaderboardVisible(true);
      play("click");
    } else {
      setLeaderboardVisible(false);
      play("click");
    }
  };

  const handleNextPhase = () => {
    play("next");
    nextPhase();
  };

  const handleExitGame = () => {
    Alert.alert(
      "Uscire dalla partita?",
      "Se esci ora, la partita verrà terminata e tornerai alla schermata principale.",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Esci",
          style: "destructive",
          onPress: () => navigation.navigate("Home"),
        },
      ],
    );
  };

  if (!roundData) return null;

  const defenderName = getPlayerName(roundData.defenderId);
  const opponentName = getPlayerName(roundData.opponentId);

  const renderPhaseContent = () => {
    const content = (() => {
      switch (phase) {
        case "ROUND_INTRO":
          return (
            <View style={styles.phaseContainer}>
              {/*   <View style={styles.roundBadge}>
                <Text style={[styles.roundBadgeText, { color: Colors.white }]}>
                  ROUND {roundNumber}
                </Text>
              </View> */}
              <View style={styles.versusLayout}>
                <View style={styles.playerColumn}>
                  <View
                    style={[
                      styles.bigAvatar,
                      { backgroundColor: Colors.primary + "20" },
                    ]}
                  >
                    <Text
                      style={[styles.avatarChar, { color: Colors.primary }]}
                    >
                      {defenderName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[
                      styles.activePlayer,
                      Typography.h2,
                      { color: themeColors.text },
                    ]}
                  >
                    {defenderName}
                  </Text>
                  <Text
                    style={[
                      Typography.caption,
                      { color: Colors.primary, fontWeight: "700" },
                    ]}
                  >
                    DIFENSORE
                  </Text>
                </View>

                <View style={styles.vsContainer}>
                  <View style={styles.vsCircle}>
                    <Text style={styles.vsText}>VS</Text>
                  </View>
                </View>

                <View style={styles.playerColumn}>
                  <View
                    style={[
                      styles.bigAvatar,
                      { backgroundColor: Colors.secondary + "20" },
                    ]}
                  >
                    <Text
                      style={[styles.avatarChar, { color: Colors.secondary }]}
                    >
                      {opponentName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[
                      styles.activePlayer,
                      Typography.h2,
                      { color: themeColors.text },
                    ]}
                  >
                    {opponentName}
                  </Text>
                  <Text
                    style={[
                      Typography.caption,
                      { color: Colors.secondary, fontWeight: "700" },
                    ]}
                  >
                    ATTACCANTE
                  </Text>
                </View>
              </View>
              <AppButton
                title="COMINCIA"
                onPress={handleNextPhase}
                style={styles.introButton}
              />
            </View>
          );
        case "DEFENSE":
          return (
            <View style={styles.phaseContainer}>
              <View
                style={[styles.roleBadge, { backgroundColor: Colors.primary }]}
              >
                <Text style={[styles.roleText, { color: Colors.white }]}>
                  DIFESA
                </Text>
              </View>
              <Text
                style={[
                  styles.activePlayerName,
                  Typography.h1,
                  { color: themeColors.text },
                ]}
              >
                {defenderName}
              </Text>
              <Text
                style={[
                  styles.instruction,
                  Typography.body,
                  { color: themeColors.subtext },
                ]}
              >
                Argomenta a favore della tesi!
              </Text>
            </View>
          );
        case "OFFENSE":
          return (
            <View style={styles.phaseContainer}>
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: Colors.secondary },
                ]}
              >
                <Text style={[styles.roleText, { color: Colors.white }]}>
                  ATTACCO
                </Text>
              </View>
              <Text
                style={[
                  styles.activePlayerName,
                  Typography.h1,
                  { color: themeColors.text },
                ]}
              >
                {opponentName}
              </Text>
              <Text
                style={[
                  styles.instruction,
                  Typography.body,
                  { color: themeColors.subtext },
                ]}
              >
                Argomenta contro la tesi!
              </Text>
            </View>
          );
        case "DISCUSSION":
          return (
            <View style={styles.phaseContainer}>
              <View
                style={[styles.roleBadge, { backgroundColor: Colors.warning }]}
              >
                <Text style={[styles.roleText, { color: Colors.black }]}>
                  DIBATTITO FINALE
                </Text>
              </View>
              <View style={styles.versusRow}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.versusPlayer,
                    Typography.h3,
                    { color: themeColors.text },
                  ]}
                >
                  {defenderName}
                </Text>
                <Text style={styles.vsSmall}>VS</Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.versusPlayer,
                    Typography.h3,
                    { color: themeColors.text },
                  ]}
                >
                  {opponentName}
                </Text>
              </View>
              <Text
                style={[
                  styles.instruction,
                  Typography.body,
                  { color: themeColors.subtext },
                ]}
              >
                Confronto libero!
              </Text>
            </View>
          );
        case "VOTING":
          return (
            <View style={votingStyles.votingContainer}>
              <Text
                style={[
                  styles.phaseTitle,
                  Typography.h2,
                  { color: Colors.primary },
                ]}
              >
                Votazione
              </Text>
              <ScrollView
                style={votingStyles.judgesList}
                showsVerticalScrollIndicator={false}
              >
                {roundData.judgeIds.map((judgeId) => (
                  <View
                    key={judgeId}
                    style={[
                      votingStyles.voteCard,
                      { backgroundColor: themeColors.card },
                    ]}
                  >
                    <View style={votingStyles.voteHeader}>
                      <Ionicons
                        name="person"
                        size={16}
                        color={Colors.primary}
                      />
                      <Text
                        style={[
                          votingStyles.judgeName,
                          Typography.body,
                          { color: themeColors.text },
                        ]}
                      >
                        Giudice:{" "}
                        <Text style={{ fontWeight: "800" }}>
                          {getPlayerName(judgeId)}
                        </Text>
                      </Text>
                    </View>
                    <View style={votingStyles.voteButtons}>
                      <AppTouchable
                        style={votingStyles.voteOption}
                        contentStyle={votingStyles.voteOptionContent}
                        active={votes[judgeId] === roundData.defenderId}
                        onPress={() =>
                          handleVote(judgeId, roundData.defenderId)
                        }
                      >
                        <Text
                          style={[
                            votingStyles.voteOptionText,
                            {
                              color:
                                votes[judgeId] === roundData.defenderId
                                  ? Colors.white
                                  : themeColors.text,
                            },
                          ]}
                        >
                          {defenderName}
                        </Text>
                      </AppTouchable>
                      <AppTouchable
                        style={votingStyles.voteOption}
                        contentStyle={votingStyles.voteOptionContent}
                        active={votes[judgeId] === roundData.opponentId}
                        onPress={() =>
                          handleVote(judgeId, roundData.opponentId)
                        }
                      >
                        <Text
                          style={[
                            votingStyles.voteOptionText,
                            {
                              color:
                                votes[judgeId] === roundData.opponentId
                                  ? Colors.white
                                  : themeColors.text,
                            },
                          ]}
                        >
                          {opponentName}
                        </Text>
                      </AppTouchable>
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
              <Text
                style={[
                  styles.phaseTitle,
                  Typography.h2,
                  { color: Colors.primary },
                ]}
              >
                Fine round {roundNumber}
              </Text>
              <View
                style={[
                  styles.leaderboardCard,
                  { backgroundColor: themeColors.card },
                ]}
              >
                <Text
                  style={[
                    styles.leaderboardTitle,
                    Typography.h3,
                    { color: themeColors.text },
                  ]}
                >
                  Classifica
                </Text>
                {players
                  .sort((a, b) => b.score - a.score)
                  .map((p, index) => (
                    <View
                      key={p.id}
                      style={[
                        styles.leaderboardRow,
                        { borderBottomColor: themeColors.border },
                        index === players.length - 1 && {
                          borderBottomWidth: 0,
                        },
                      ]}
                    >
                      <View style={styles.playerRank}>
                        <Text
                          style={[styles.rankText, { color: Colors.primary }]}
                        >
                          #{index + 1}
                        </Text>
                        <Text
                          style={[
                            styles.playerName,
                            Typography.body,
                            { color: themeColors.text },
                          ]}
                        >
                          {p.name}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.scoreBadge,
                          { backgroundColor: Colors.primary + "10" },
                        ]}
                      >
                        <Text
                          style={[styles.scoreValue, { color: Colors.primary }]}
                        >
                          {p.score}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
              <AppButton title="PROSSIMO ROUND" onPress={startRound} />
            </View>
          );
        default:
          return null;
      }
    })();

    return (
      <Animated.View
        style={[
          styles.animatedContent,
          {
            opacity: phaseFadeAnim,
            transform: [{ translateY: phaseSlideAnim }],
          },
        ]}
      >
        {content}
      </Animated.View>
    );
  };

  const handleSkipTimer = () => {
    setTimerStatus("FINISHED");
    setTimeLeft(0);
    play("end");
  };

  const isTimerPhase = ["DEFENSE", "OFFENSE", "DISCUSSION"].includes(phase);

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <AppButton
          variant="icon"
          onPress={handleExitGame}
          icon={<Ionicons name="close" size={24} color={Colors.danger} />}
        />

        <Text
          style={[
            Typography.h3,
            { color: themeColors.text, fontWeight: "800" },
          ]}
        >
          Round {roundNumber}
        </Text>

        <AppButton
          variant="icon"
          onPress={toggleLeaderboard}
          icon={<Ionicons name="podium" size={22} color={Colors.primary} />}
        />
      </View>

      {phase !== "ROUND_INTRO" && (
        <View
          style={[styles.thesisCard, { backgroundColor: themeColors.card }]}
        >
          <View style={styles.thesisHeader}>
            <Ionicons name="bulb-outline" size={16} color={Colors.primary} />
            <Text style={[styles.thesisLabel, { color: Colors.primary }]}>
              TESI
            </Text>
          </View>
          <Text
            style={[
              styles.thesisText,
              Typography.h3,
              { color: themeColors.text },
            ]}
          >
            {roundData.thesis}
          </Text>
        </View>
      )}

      {isTimerPhase && (
        <View style={styles.timerSection}>
          <Animated.View style={{ transform: [{ scale: timerScaleAnim }] }}>
            <Text
              style={[
                styles.timerText,
                { color: themeColors.text },
                timeLeft <= 10 && { color: Colors.danger },
              ]}
            >
              {timeLeft > 0 ? `${minutes}:${seconds}` : "STOP!"}
            </Text>
          </Animated.View>

          <View style={styles.timerControls}>
            {timerStatus === "FINISHED" ? (
              <AppButton
                title="PROSSIMA FASE"
                onPress={handleNextPhase}
                style={styles.timerBtn}
              />
            ) : (
              <View style={styles.controlsRow}>
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
                  style={styles.timerBtn}
                />
                {(timerStatus === "RUNNING" || timerStatus === "PAUSED") && (
                  <AppButton
                    variant="icon"
                    onPress={handleSkipTimer}
                    icon={
                      <Ionicons
                        name="play-skip-forward"
                        size={24}
                        color={Colors.primary}
                      />
                    }
                    style={styles.skipBtn}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.mainContent}>{renderPhaseContent()}</View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isLeaderboardVisible}
        onRequestClose={() => setLeaderboardVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  Typography.h2,
                  { color: themeColors.text },
                ]}
              >
                Classifica
              </Text>
              <AppButton
                variant="icon"
                onPress={() => setLeaderboardVisible(false)}
                icon={
                  <Ionicons name="close" size={24} color={Colors.primary} />
                }
              />
            </View>
            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {players
                .sort((a, b) => b.score - a.score)
                .map((p, index) => (
                  <View
                    key={p.id}
                    style={[
                      styles.leaderboardRow,
                      { borderBottomColor: themeColors.border },
                    ]}
                  >
                    <View style={styles.playerRank}>
                      <Text
                        style={[styles.rankText, { color: Colors.primary }]}
                      >
                        #{index + 1}
                      </Text>
                      <Text
                        style={[
                          styles.playerName,
                          Typography.body,
                          { color: themeColors.text },
                        ]}
                      >
                        {p.name}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.scoreBadge,
                        { backgroundColor: Colors.primary + "10" },
                      ]}
                    >
                      <Text
                        style={[styles.scoreValue, { color: Colors.primary }]}
                      >
                        {p.score}
                      </Text>
                    </View>
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

const votingStyles = StyleSheet.create({
  votingContainer: {
    flex: 1,
  },
  judgesList: {
    flex: 1,
    marginVertical: Spacing.md,
  },
  voteCard: {
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  voteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: Spacing.sm,
  },
  judgeName: {
    fontSize: 14,
  },
  voteButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  voteOption: {
    flex: 1,
    height: 54,
  },
  voteOptionContent: {
    paddingHorizontal: Spacing.sm,
  },
  voteOptionText: {
    fontWeight: "700",
    fontSize: 14,
  },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  thesisCard: {
    padding: Spacing.lg,
    borderRadius: 24,
    marginBottom: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  thesisHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  thesisLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  thesisText: {
    fontWeight: "700",
    lineHeight: 28,
  },
  timerSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  timerText: {
    fontSize: 72,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
    letterSpacing: -2,
  },
  timerControls: {
    flexDirection: "row",
    marginTop: Spacing.md,
    width: "100%",
    paddingHorizontal: Spacing.xl,
  },
  timerBtn: {
    flex: 1,
  },
  controlsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  skipBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
  },
  phaseContainer: {
    alignItems: "center",
    paddingTop: Spacing.lg,
  },
  roundBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: Spacing.lg,
  },
  roundBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  versusLayout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  playerColumn: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.sm,
  },
  vsContainer: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  bigAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarChar: {
    fontSize: 32,
    fontWeight: "800",
  },
  activePlayer: {
    textAlign: "center",
  },
  vsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  vsText: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.primary,
  },
  introButton: {
    width: "80%",
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: Spacing.md,
  },
  roleText: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  activePlayerName: {
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  instruction: {
    textAlign: "center",
  },
  versusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  versusPlayer: {
    flex: 1,
    fontWeight: "700",
    textAlign: "center",
  },
  vsSmall: {
    fontSize: 12,
    fontWeight: "900",
    color: Colors.warning,
  },
  phaseTitle: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  roundEndContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  leaderboardCard: {
    padding: Spacing.lg,
    borderRadius: 24,
    marginBottom: Spacing.xl,
  },
  leaderboardTitle: {
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  leaderboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  playerRank: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  rankText: {
    fontSize: 16,
    fontWeight: "900",
    width: 30,
  },
  playerName: {
    fontWeight: "600",
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreValue: {
    fontWeight: "800",
    fontSize: 16,
  },
  animatedContent: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    borderRadius: 32,
    padding: Spacing.xl,
    borderWidth: 1,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontWeight: "800",
  },
  modalScroll: {
    marginBottom: Spacing.xl,
  },
});
