import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export class Feature3Page extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>This is the page for Feature 3</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Feature3Page;
