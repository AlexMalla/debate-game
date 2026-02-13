import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { ScreenLayout } from "../components/ScreenLayout";
import { Colors } from "../constants/Colors";
import { AppButton } from "../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "../hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";

export const CreditsScreen = () => {
  const navigation = useNavigation();
  const themeColors = useThemeColors();

  return (
    <ScreenLayout style={styles.container}>
      {/* ───────── HEADER ───────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: Colors.primary }]}>
          Crediti
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.role, { color: themeColors.subtext }]}>
            Sviluppato da
          </Text>
          <Text style={[styles.name, { color: themeColors.text }]}>
            Alex Mallamaci
          </Text>
          <Text style={[styles.subrole, { color: themeColors.subtext }]}>
            (Malla)
          </Text>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingBottom: 40,
  },
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
});
