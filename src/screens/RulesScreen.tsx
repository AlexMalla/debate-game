import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ScreenLayout } from "../components/ScreenLayout";
import { Colors } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "../hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";

export const RulesScreen = () => {
  const navigation = useNavigation();
  const themeColors = useThemeColors();

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
          Regole
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ───────── SETUP ───────── */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            1. Setup
          </Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            Inserisci i nomi dei giocatori (minimo 3). Scegli la modalità di
            gioco:
          </Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            • <Text style={styles.bold}>Tutti contro tutti:</Text> ogni
            giocatore sfida tutti gli altri.
          </Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            {" "}
            • <Text style={styles.bold}>Modalità rapida:</Text> ogni giocatore
            fa un solo dibattito (minimo 4 giocatori).
          </Text>
        </View>

        {/* ───────── IL TURNO ───────── */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            2. Il Turno
          </Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            In ogni turno vengono scelti casualmente un{" "}
            <Text style={styles.bold}>Difensore</Text> e un{" "}
            <Text style={styles.bold}>Oppositore</Text>. Viene mostrata una tesi
            casuale su cui discutere.
          </Text>
        </View>

        {/* ───────── IL DIBATTITO ───────── */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            3. Dibattito
          </Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            Ogni dibattito è diviso in 3 fasi:
          </Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, { color: themeColors.text }]}>
              • <Text style={styles.bold}>Difesa:</Text> Il Difensore argomenta
              a favore della tesi.
            </Text>
            <Text style={[styles.listItem, { color: themeColors.text }]}>
              • <Text style={styles.bold}>Attacco:</Text> L'Oppositore argomenta
              contro la tesi.
            </Text>
            <Text style={[styles.listItem, { color: themeColors.text }]}>
              • <Text style={styles.bold}>Discussion finale:</Text> Dibattito
              libero tra i due.
            </Text>
          </View>
        </View>

        {/* ───────── VOTAZIONE ───────── */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            4. Votazione
          </Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            I giocatori non coinvolti diventano{" "}
            <Text style={styles.bold}>Giudici</Text> e votano chi è stato più
            convincente.
          </Text>
        </View>

        {/* ───────── VITTORIA ───────── */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            5. Vittoria
          </Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            Ogni voto vale 1 punto. Al termine della partita, il giocatore con
            il punteggio più alto vince.
          </Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: "bold",
    color: Colors.primary,
  },
  list: {
    marginTop: 10,
    gap: 5,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
  },
});
