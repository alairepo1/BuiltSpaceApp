import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ListItem, ShadowPropTypesIOS} from 'react-native';


function SamsListItem(props) {
    return (
        <TouchableWithoutFeedback
        onPress={props.onPress}
        >
        <View style={props.styles.container}>
          <Text style={props.styles.category}>Asset Category:</Text>
          <Text>{props.categoryabbreviation}</Text>
           <Text style={props.styles.title}>Checklist Id:</Text><Text>{props.checklistId}</Text>
            
        </View>
        </TouchableWithoutFeedback>
    )
}

export default SamsListItem