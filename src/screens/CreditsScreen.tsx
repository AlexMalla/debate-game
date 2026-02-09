import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { ScreenLayout } from "../components/ScreenLayout";
import { Colors } from "../constants/Colors";
import { AppButton } from "../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "../hooks/useThemeColors";

export const CreditsScreen = () => {
  const navigation = useNavigation();
  const themeColors = useThemeColors();

  return (
    <ScreenLayout style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Crediti</Text>

        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.role, { color: themeColors.subtext }]}>Sviluppato da</Text>
          <Text style={[styles.name, { color: themeColors.text }]}>Alex Mallamaci</Text>
          <Text style={[styles.subrole, { color: themeColors.subtext }]}>(Malla)</Text>
        </View>

        {/*      <View style={styles.card}>
          <Text style={styles.role}>Tecnologie</Text>
          <Text style={styles.tech}>React Native</Text>
          <Text style={styles.tech}>Expo</Text>
          <Text style={styles.tech}>TypeScript</Text>
          <Text style={styles.tech}>Zustand</Text>
          <Text style={styles.tech}>React Navigation</Text>
        </View> */}
      </View>

      <AppButton
        title="Torna Indietro"
        onPress={() => navigation.goBack()}
        variant="outline"
      />
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 40,
  },
  card: {
    width: "100%",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  role: {
    fontSize: 14,
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subrole: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: "italic",
  },
  tech: {
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 4,
  },
});
