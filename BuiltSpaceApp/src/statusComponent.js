import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export class StatusBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.status}>
        <View style={styles.connection_color}>
          <Text>Connection Status: {this.props.connection_status}</Text>
        </View>
        <Text>Signed in as: {this.props.email}</Text>
        <Text>Current Organization: {this.props.organization}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  status_container: {},
  connection_color: {
    backgroundColor: 'lightgreen',
  },
});

export default StatusBar;
