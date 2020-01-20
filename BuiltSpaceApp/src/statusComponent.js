import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export class StatusBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connection_status: "<not implemented>",
      email: "<fetch email>",
      organization: "<fetch current organization api>"
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.status}>
          <View style={styles.connection_color}>
            <Text>Connection Status: {this.state.connection_status}</Text>
          </View>
          <Text>Signed in as: {this.state.email}</Text>
          <Text>Current Organization: {this.state.organization}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  status_container: {},
  connection_color: {
    backgroundColor: "lightgreen"
  }
});

export default StatusBar;
