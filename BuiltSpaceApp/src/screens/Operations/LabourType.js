import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ListItem, ShadowPropTypesIOS} from 'react-native';


export class LabourType extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View>
                <Text>Labour Type</Text>
                <Text>{this.props.question.item.id} {this.props.question.item.question}</Text>
            </View>
        )
    }
}

export default LabourType