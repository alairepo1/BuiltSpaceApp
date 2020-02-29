import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export class StatusBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: '',
      connectionMsg: ''
    };
  }

  subscribe = NetInfo.addEventListener(state => {
    console.log('wifi status: ', state.isConnected)
    if (state.isConnected) {
      // is connected
      this.props.isConnected.updateConnection(state.isConnected)
      // runn updateConnection function
      this.setState({
        connection_color: 'lightgrey',
        connectionMsg: 'Connected'
      });
    }

    if (!state.isConnected) {
      // not connected
      this.props.isConnected.updateConnection(state.isConnected)
      this.setState({
        connection_color: 'red',
        connectionMsg: 'No Connection.'
      });
    }
  });

  componentDidMount = () => {
    this.subscribe();
  };

  render() {
    return this.state.isConnected ? (
      <View style={styles.status}>
        <View
          style={
            ([styles.input], {backgroundColor: this.state.connection_color})
          }>
          <Text>Connection Status: {this.state.connectionMsg}</Text>
        </View>
      </View>
    ) : (
      <View style={styles.status}>
        <View
          style={
            ([styles.input], {backgroundColor: this.state.connection_color})
          }>
          <Text>Connection Status: {this.state.connectionMsg}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  status_container: {},
  // connection_color: {
  //   backgroundColor: 'lightgreen',
  // },
});

export default StatusBar;
