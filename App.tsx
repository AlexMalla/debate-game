import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { HomeScreen } from "./src/screens/HomeScreen";
import { SetupScreen } from "./src/screens/SetupScreen";
import { GameScreen } from "./src/screens/GameScreen";
import { VictoryScreen } from "./src/screens/VictoryScreen";
import { RulesScreen } from "./src/screens/RulesScreen";
import { CreditsScreen } from "./src/screens/CreditsScreen";
import { Colors } from "./src/constants/Colors";
import { useGameStore } from "./src/store/useGameStore";
import { PlayersScreen } from "./src/screens/PlayersScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

export default function App() {
  const isDarkMode = useGameStore((state) => state.settings.isDarkMode);

  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.light.background,
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.dark.background,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
          <StatusBar style={isDarkMode ? "light" : "dark"} />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Setup" component={SetupScreen} />
            <Stack.Screen name="Players" component={PlayersScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen name="Victory" component={VictoryScreen} />
            <Stack.Screen name="Rules" component={RulesScreen} />
            <Stack.Screen name="Credits" component={CreditsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
