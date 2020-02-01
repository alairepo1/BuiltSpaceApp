import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export class SelectBuildingScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Select Building Screen -> Select Location/Asset</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SelectBuildingScreen;
