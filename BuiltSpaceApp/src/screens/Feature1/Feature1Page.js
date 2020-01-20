import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import StatusBar from "../../statusComponent.js";

export class Feature1Page extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        <Text>This is the page for Feature 1</Text>
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

export default Feature1Page;
