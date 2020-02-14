import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import LoginForm from './LoginForm';

export default class Login extends Component {
    render() {
        const {navigate} = this.props.navigation;
        return ( 
            <View style = {styles.container}>
                <View style = {styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source = {require('../../images/logo.png')}/> 
                </View>
                <View style = {styles.formContainer}>
                <LoginForm navigation={navigate} / >
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        width: 235,
        height: 250
    }
});