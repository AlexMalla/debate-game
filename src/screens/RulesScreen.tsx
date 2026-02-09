import React from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { Colors } from '../constants/Colors';
import { AppButton } from '../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../hooks/useThemeColors';

export const RulesScreen = () => {
  const navigation = useNavigation();
  const themeColors = useThemeColors();

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Regole del Gioco</Text>
        
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>1. Setup</Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            Inserisci i nomi dei giocatori (minimo 3). Scegliete il punteggio per vincere (3, 5 o 10 punti).
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>2. Il Turno</Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            In ogni turno vengono scelti casualmente un <Text style={styles.bold}>Difensore</Text> e un <Text style={styles.bold}>Oppositore</Text>.
            Viene mostrata una tesi casuale (es. "L'ananas sulla pizza è buono").
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>3. Il Dibattito</Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            Il dibattito è diviso in 3 fasi da 1 minuto ciascuna:
          </Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, { color: themeColors.text }]}>• <Text style={styles.bold}>Difesa:</Text> Il Difensore argomenta a favore della tesi.</Text>
            <Text style={[styles.listItem, { color: themeColors.text }]}>• <Text style={styles.bold}>Attacco:</Text> L'Oppositore argomenta contro la tesi.</Text>
            <Text style={[styles.listItem, { color: themeColors.text }]}>• <Text style={styles.bold}>Discussione:</Text> Dibattito libero tra i due.</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>4. Votazione</Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            Al termine del tempo, i giocatori che non hanno partecipato al dibattito diventano <Text style={styles.bold}>Giudici</Text> e votano chi è stato più convincente.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>5. Vittoria</Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            Ogni voto vale 1 punto. Il primo giocatore che raggiunge il punteggio prefissato vince la partita!
          </Text>
        </View>

        <AppButton title="Torna Indietro" onPress={() => navigation.goBack()} variant="outline" style={styles.button} />
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
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
    fontWeight: '700',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
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
  button: {
    marginTop: 20,
  }
});
