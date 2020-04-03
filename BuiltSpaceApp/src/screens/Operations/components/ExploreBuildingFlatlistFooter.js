import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import styles from '../BuildingScreen.style.js';

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
          style={styles.FlatListFooter}>
          <Text>Add labour</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.addQuestion('materials');
          }}
          style={styles.FlatListFooter}>
          <Text>Add materials</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.addQuestion('issue')}
          style={styles.FlatListFooter}>
          <Text>Add issue</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ExploreBuildingFlatlistFooter;
