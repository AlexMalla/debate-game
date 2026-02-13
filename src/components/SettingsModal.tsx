import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Colors } from "../constants/Colors";
import { useGameStore } from "../store/useGameStore";
import { AppButton } from "./AppButton";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../hooks/useThemeColors";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const { settings, toggleSound, toggleTheme } = useGameStore();
  const themeColors = useThemeColors();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: themeColors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              Impostazioni
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={themeColors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Ionicons
                name={settings.isSoundEnabled ? "volume-high" : "volume-mute"}
                size={24}
                color={Colors.primary}
              />
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Suoni
              </Text>
            </View>
            <Switch
              trackColor={{ false: themeColors.border, true: Colors.primary }}
              thumbColor={Colors.white}
              onValueChange={toggleSound}
              value={settings.isSoundEnabled}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Ionicons
                name={settings.isDarkMode ? "moon" : "sunny"}
                size={24}
                color={Colors.primary}
              />
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Tema scuro
              </Text>
            </View>
            <Switch
              trackColor={{ false: themeColors.border, true: Colors.primary }}
              thumbColor={Colors.white}
              onValueChange={toggleTheme}
              value={settings.isDarkMode}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.version, { color: themeColors.subtext }]}>
              v1.0.0
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  settingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    marginTop: 10,
  },
  version: {
    fontSize: 12,
  },
});
