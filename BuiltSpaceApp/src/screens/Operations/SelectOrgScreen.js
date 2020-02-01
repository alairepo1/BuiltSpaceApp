import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import StatusBar from '../../statusComponent.js';

export class SelectOrgScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      org_data: [],
    };
  }

  componentDidMount = () => {
    this.fetch();
  };

  fetch = () => {};

  render() {
    return (
      <View style={styles.container}>
        <Text>
          When creating new screen, add the screen into
          ../../Navigator/navigator.js HomeStack
        </Text>
        <Text>
          Load Org data with a flat list, flat list will have a button to select
          building and goto next screen.
        </Text>
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

export default SelectOrgScreen;
