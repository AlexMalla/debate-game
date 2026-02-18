import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { ScreenLayout } from "../components/ScreenLayout";
import { Colors, Typography, Spacing } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "../hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { AppButton } from "../components/AppButton";

export const RulesScreen = () => {
  const navigation = useNavigation();
  const themeColors = useThemeColors();

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

  const RuleSection = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: string;
    children: React.ReactNode;
  }) => (
    <View style={[styles.section, { backgroundColor: themeColors.card }]}>
      <View style={styles.sectionHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: Colors.primary + "15" },
          ]}
        >
          <Ionicons name={icon as any} size={24} color={Colors.primary} />
        </View>
        <Text style={[Typography.h3, { color: themeColors.text }]}>
          {title}
        </Text>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

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
            Regole
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <RuleSection title="1. Setup" icon="settings-outline">
            <Text style={[Typography.body, { color: themeColors.text }]}>
              Inserisci i nomi dei giocatori (minimo 3). Scegli la modalità di
              gioco:
            </Text>
            <View style={styles.list}>
              <Text style={[Typography.body, { color: themeColors.text }]}>
                • <Text style={styles.bold}>Tutti contro tutti:</Text> ogni
                giocatore sfida tutti gli altri.
              </Text>
              <Text style={[Typography.body, { color: themeColors.text }]}>
                • <Text style={styles.bold}>Modalità rapida:</Text> ogni
                giocatore fa un solo dibattito.
              </Text>
            </View>
          </RuleSection>

          <RuleSection title="2. Il Turno" icon="swap-horizontal-outline">
            <Text style={[Typography.body, { color: themeColors.text }]}>
              In ogni turno vengono scelti casualmente un{" "}
              <Text style={styles.bold}>Difensore</Text> e un{" "}
              <Text style={styles.bold}>Attaccante</Text>. Viene mostrata una
              tesi casuale su cui discutere.
            </Text>
          </RuleSection>

          <RuleSection title="3. Dibattito" icon="chatbubbles-outline">
            <Text style={[Typography.body, { color: themeColors.text }]}>
              Ogni dibattito è diviso in 3 fasi:
            </Text>
            <View style={styles.list}>
              <View style={styles.listItemRow}>
                <View style={styles.bullet} />
                <Text style={[Typography.body, { color: themeColors.text }]}>
                  <Text style={styles.bold}>Difesa:</Text> Il Difensore
                  argomenta a favore della tesi.
                </Text>
              </View>
              <View style={styles.listItemRow}>
                <View style={styles.bullet} />
                <Text style={[Typography.body, { color: themeColors.text }]}>
                  <Text style={styles.bold}>Attacco:</Text> L'Oppositore
                  argomenta contro la tesi.
                </Text>
              </View>
              <View style={styles.listItemRow}>
                <View style={styles.bullet} />
                <Text style={[Typography.body, { color: themeColors.text }]}>
                  <Text style={styles.bold}>Discussione:</Text> Dibattito libero
                  tra i due.
                </Text>
              </View>
            </View>
          </RuleSection>

          <RuleSection title="4. Votazione" icon="checkmark-circle-outline">
            <Text style={[Typography.body, { color: themeColors.text }]}>
              I giocatori non coinvolti diventano{" "}
              <Text style={styles.bold}>Giudici</Text> e votano chi è stato più
              convincente.
            </Text>
          </RuleSection>

          <RuleSection title="5. Vittoria" icon="trophy-outline">
            <Text style={[Typography.body, { color: themeColors.text }]}>
              Ogni voto vale 1 punto. Al termine della partita, il giocatore con
              il punteggio più alto vince.
            </Text>
          </RuleSection>
        </ScrollView>
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
  headerSpacer: {
    width: 44,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 20,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionContent: {
    paddingLeft: 0,
  },
  bold: {
    fontWeight: "bold",
    color: Colors.primary,
  },
  list: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  listItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 10,
  },
});
