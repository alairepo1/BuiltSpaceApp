import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import StatusBar from '../../statusComponent.js';

export class AssetScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Assets: [],
      Checklist: [],
    };
  }

  componentDidMount = () => {
    this.fetch();
  };

  fetch = () => {};

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          When creating new screen, add the screen into
          ../../Navigator/navigator.js HomeStack
        </Text>
        <Text style={styles.text}>Fetch Asset and Checklist API</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#324679',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default AssetScreen;
