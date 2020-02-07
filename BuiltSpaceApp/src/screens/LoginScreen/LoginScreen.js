import React, {Component} from 'react';
import {View, StyleSheet, Text, Button, TouchableOpacity, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

export class LoginScreen extends Component {

  navigation(){
    this.props.navigation.navigate('HomeStack');
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
            style = {styles.image}
            source = {require('./BuiltSpace_Logo.jpg')}
        />
        <Text>This is the login screen</Text>
        <Text>
          Authentication Listener goes into ../LoadingScreen/LoadingScreen.js
        </Text>
        <View style={styles.button}>
            <TouchableOpacity onPress={() => {
                this.navigation()
              }}
            >
                <Text>Log In</Text>
            </TouchableOpacity>
        </View>
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
  button: {
    backgroundColor: 'blue',
    borderColor: 'white',
    borderWidth: 5,
    borderRadius: 0,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 12,
    textAlign:'center',
  },
  image: {
    width: 200,
    height: 200
  }
});

export default LoginScreen;
