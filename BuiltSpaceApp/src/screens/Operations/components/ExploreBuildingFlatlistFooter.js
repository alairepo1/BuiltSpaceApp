import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

class ExploreBuildingFlatlistFooter extends Component {
    /**
     * the footer for the flatlist in ExploreBuildingScreen
     */
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{flex: 3, flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            this.props.addQuestion('labour');
          }}
          style={sytles.button}>
          <Text>Add labour</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.addQuestion('materials');
          }}
          style={sytles.button}>
          <Text>Add materials</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.addQuestion('issue')}
          style={sytles.button}>
          <Text>Add issue</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const sytles =  StyleSheet.create ({
  button: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 40,
    margin: 2,
    backgroundColor: 'lightgrey'
  }
})
export default ExploreBuildingFlatlistFooter;
