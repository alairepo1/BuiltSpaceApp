import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomTabNavigator from "./src/BottomTabNavigator.js";
import Navigator from "./src/Navigator/Navigator.js";
import SafeAreaView from "react-native-safe-area-view";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <Navigator />
    </SafeAreaProvider>
  );
  // <BottomTabNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
