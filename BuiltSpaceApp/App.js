/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';

// import BottomTabNavigator from './src/BottomTabNavigator.js';
import Navigator from './src/Navigator/Navigator.js';
import SafeAreaView from 'react-native-safe-area-view';
import {SafeAreaProvider} from 'react-native-safe-area-context';

class App extends Component {
  render() {
    return (
      <SafeAreaProvider>
        {<Text>Hello</Text>}
        <Navigator />
        {/* <RealmDb /> */}
      </SafeAreaProvider>
    );
    // <BottomTabNavigator />;
  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
