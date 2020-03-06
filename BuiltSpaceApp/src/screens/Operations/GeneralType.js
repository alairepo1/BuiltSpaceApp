import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ListItem, ShadowPropTypesIOS} from 'react-native';


export class GeneralType extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ backgroundColor: 'white', margin: 5, padding: 5 }}>
                <Text>General Type</Text>
                <Text>{this.props.question.item.id} {this.props.question.item.question}</Text>
            </View>
        )
    }
}

export default GeneralType