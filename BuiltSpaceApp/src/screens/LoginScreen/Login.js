import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import LoginForm from './LoginForm';

export default class Login extends Component {
    render() {
        return (
            <View style={styles.container}>
                    <View style={styles.logoContainer}>
                        <Image
                        style={styles.logo}
                        source={require('../../images/logo.png')} />
                    </View>
                    <View style={styles.formContainer}>
                    <LoginForm />>
                    </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#324679'
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        width: 1000,
        height: 240
    }
});