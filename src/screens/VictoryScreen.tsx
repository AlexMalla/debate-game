import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../components/ScreenLayout";
import { AppButton } from "../components/AppButton";
import { Colors } from "../constants/Colors";
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

  const winners = (winnerIds || [])
    .map((id) => players.find((p) => p.id === id))
    .filter(Boolean) as typeof players;

  const handleRestart = () => {
    resetGame();
    navigation.replace("Home");
  };

  return (
    <ScreenLayout style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="trophy" size={100} color={Colors.warning} />
        {winnerIds && winnerIds.length > 1 ? (
          winnerIds.length === players.length ? (
            <>
              <Text style={styles.congrats}>Pareggio!</Text>
            </>
          ) : (
            <>
              <Text style={styles.congrats}>Vittoria!</Text>

              {winners.map((w) => (
                <Text
                  key={w.id}
                  style={[styles.winnerName, { color: themeColors.text }]}
                >
                  {w.name}
                </Text>
              ))}
            </>
          )
        ) : (
          (() => {
            const winner = players.find(
              (p) => p.id === (winnerIds && winnerIds[0]),
            );
            return winner ? (
              <>
                <Text style={styles.congrats}>Vittoria!</Text>
                <Text style={[styles.winnerName, { color: themeColors.text }]}>
                  {winner.name}
                </Text>
              </>
            ) : null;
          })()
        )}
      </View>

      <View
        style={{
          borderRadius: 15,
          padding: 20,
          marginVertical: 20,
          borderWidth: 1,
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 15,
            textAlign: "center",
            color: themeColors.text,
          }}
        >
          Classifica
        </Text>
        <ScrollView
          style={{ maxHeight: 280 }}
          showsVerticalScrollIndicator={false}
        >
          {players
            .slice()
            .sort((a, b) => b.score - a.score)
            .map((p, index) => (
              <View
                key={p.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: themeColors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.primary,
                    fontWeight: "bold",
                    width: 40,
                  }}
                >
                  #{index + 1}
                </Text>
                <Text
                  style={{ fontSize: 16, flex: 1, color: themeColors.text }}
                >
                  {p.name}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: Colors.primary,
                    width: 40,
                    textAlign: "right",
                  }}
                >
                  {p.score}
                </Text>
              </View>
            ))}
        </ScrollView>
      </View>

      <AppButton title="TORNA ALLA HOME" onPress={handleRestart} />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  congrats: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 20,
  },
  winnerName: {
    fontSize: 48,
    fontWeight: "900",
    marginVertical: 10,
    textAlign: "center",
  },
  scoreText: {
    fontSize: 18,
  },
});
