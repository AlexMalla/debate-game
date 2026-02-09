import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../components/ScreenLayout";
import { AppButton } from "../components/AppButton";
import { SettingsModal } from "../components/SettingsModal";
import { Colors } from "../constants/Colors";
import { useThemeColors } from "../hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Setup: undefined;
  Rules: undefined;
  Credits: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const themeColors = useThemeColors();

  return (
    <ScreenLayout style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsSettingsVisible(true)}>
          <Ionicons
            name="settings-outline"
            size={28}
            color={themeColors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Dibattito</Text>
          <Text style={[styles.subtitle, { color: themeColors.subtext }]}>
            Il Party Game Definitivo
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            title="GIOCA"
            onPress={() => navigation.navigate("Setup")}
            style={styles.playButton}
          />
          <AppButton
            title="COME GIOCARE"
            onPress={() => navigation.navigate("Rules")}
            variant="secondary"
          />
          <AppButton
            title="CREDITI"
            onPress={() => navigation.navigate("Credits")}
            variant="outline"
          />
        </View>
      </View>

      <SettingsModal
        visible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  header: {
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  titleContainer: {
    marginBottom: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: Colors.primary,
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 15,
  },
  playButton: {
    paddingVertical: 20,
    marginBottom: 10,
  },
});
