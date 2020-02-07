import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, StatusBar, ScrollView } from 'react-native';

export default class LoginForm extends Component {
    render() {
        return (
          <ScrollView>
            <KeyboardAvoidingView behavior = "padding" style = {styles.container} >
            <StatusBar 
                barStyle = "light-content" 
            />
            <TextInput
                placeholder = "Email Address"
                placeholderTextColor = "rgba(255, 255, 255, 0.7)"
                returnKeyType = "next"
                onSubmitEditing = {() => this.passwordInput.focus()}
                keyboardType = "email-address"
                autoCapitalize = "none"
                autoCorrect = {false}
                style = {styles.input}
            /> 
            <TextInput
                placeholder = "Password"
                placeholderTextColor = "rgba(255, 255, 255, 0.7)"
                returnKeyType = "go"
                secureTextEntry style = {styles.input}
                ref = {(input) => this.passwordInput = input}
            />
            <TouchableOpacity style = {styles.buttonContainer}>
                <Text style = {styles.buttonText} > Login </Text>
            </TouchableOpacity>
            </KeyboardAvoidingView>
          </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    input: {
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
        color: 'white',
        paddingHorizontal: 10
    },
    buttonContainer: {
        backgroundColor: '#4CBB17',
        paddingVertical: 10,
        marginBottom: 10
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700'
    }
});