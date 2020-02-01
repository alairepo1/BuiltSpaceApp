import React, {Component} from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

export class LoginScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>This is the login screen</Text>
        <Text>
          Authentication Listener goes into ../LoadingScreen/LoadingScreen.js
        </Text>
        <Button
          onPress={() => {
            this.props.navigation.navigate('HomeStack');
          }}
          title="Log In"
        />
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

export default LoginScreen;
