import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ListItem} from 'react-native';


function SamsListItem(props) {
    return (
        <TouchableWithoutFeedback
        onPress={props.onPress}
        >
        <View style={props.styles.container}>
          
          <Text style={props.styles.category}>Asset Category:</Text>

            <Text>{props.assetCategory}</Text>
            <Text>{props.categoryabbreviation}</Text>
        </View>
        </TouchableWithoutFeedback>
    )
}

export default SamsListItem