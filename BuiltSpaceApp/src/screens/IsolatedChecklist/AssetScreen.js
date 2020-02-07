import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import StatusBar from '../../statusComponent.js';
import { BorderlessButton } from 'react-native-gesture-handler';

export class AssetScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Assets: [],
      Checklist: [],
      key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
      isloading: true
    };
  
  this.fetch = this.fetch.bind(this);
  }
  
  fetch = () => { 
    fetch('https://beta.builtspace.com/sites/bcitproject/_vti_bin/wcf/orgdata.svc/procedures',
    {
      method: 'get',
      headers: {
        Authorization: this.state.key
      },
    },
    ).then(response => response.json())
    .then(results => {
      
      this.setState({
        Checklist: results,
        isloading: false
      })
    })
  };

  componentDidMount = () => {
    this.fetch();
  };
  render () {
      console.log(this.state.Checklist)
    if (this.state.isloading) {
      return (
      <View><Text>Loading</Text></View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.header}>Fetch Asset and Checklist API</Text>
          
          <Text style={styles.category}>Asset Category:</Text><Text>{JSON.stringify(this.state.Checklist[0].assetCategory)}</Text>
          <Text style={styles.title}>Asset Title:</Text><Text>{JSON.stringify(this.state.Checklist[0].title)}</Text>
          <Text style={styles.title}>Asset Id:</Text><Text> {JSON.stringify(this.state.Checklist[0].id)}</Text>
          
          <Text style={styles.category}>Asset Category:</Text><Text>{JSON.stringify(this.state.Checklist[1].assetCategory)}</Text>
          <Text style={styles.title}>Asset Title:</Text><Text>{JSON.stringify(this.state.Checklist[1].title)}</Text>
          <Text style={styles.title}>Asset Id:</Text><Text> {JSON.stringify(this.state.Checklist[1].id)}</Text>

          <Text style={styles.category}>Asset Category:</Text><Text>{JSON.stringify(this.state.Checklist[2].assetCategory)}</Text>
          <Text style={styles.title}>Asset Title:</Text><Text>{JSON.stringify(this.state.Checklist[2].title)}</Text>
          <Text style={styles.title}>Asset Id:</Text><Text> {JSON.stringify(this.state.Checklist[2].id)}</Text>
          
          <Text style={styles.category}>Asset Category:</Text><Text>{JSON.stringify(this.state.Checklist[3].assetCategory)}</Text>
          <Text style={styles.title}>Asset Title:</Text><Text>{JSON.stringify(this.state.Checklist[3].title)}</Text>
          <Text style={styles.title}>Asset Id:</Text><Text> {JSON.stringify(this.state.Checklist[3].id)}</Text>
        </View>
      )}
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default AssetScreen;
