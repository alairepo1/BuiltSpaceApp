import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

import React, { Component } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Splash from './Splash';
import Login from './src/screens/LoginScreen/Login';

export default class GithubApp extends Component {
    render() {
        return (
            <Login />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyCOntent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'

    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
})