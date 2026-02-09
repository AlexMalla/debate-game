import React from "react";
import { View, Text, StyleSheet } from "react-native";
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
  const { winnerId, players, resetGame } = useGameStore();
  const themeColors = useThemeColors();

  const winner = players.find((p) => p.id === winnerId);

  const handleRestart = () => {
    resetGame();
    navigation.replace("Home");
  };

  return (
    <ScreenLayout style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="trophy" size={100} color={Colors.warning} />
        <Text style={styles.congrats}>Vittoria!</Text>

        {winner && (
          <>
            <Text style={[styles.winnerName, { color: themeColors.text }]}>
              {winner.name}
            </Text>
            <Text style={[styles.scoreText, { color: themeColors.subtext }]}>
              Ha raggiunto {winner.score} punti
            </Text>
          </>
        )}
      </View>

      <AppButton title="NUOVA PARTITA" onPress={handleRestart} />
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
