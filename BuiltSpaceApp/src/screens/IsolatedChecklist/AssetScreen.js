import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import StatusBar from '../../statusComponent.js';

export class AssetScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Assets: [],
      Checklist: [],
      key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
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
        Checklist: results
      })
    })
  };

  componentDidMount = () => {
    this.fetch();
  };
  render () {
      console.log(this.state.Checklist)
    if (this.state.Checklist) {
      return (
        <View style={styles.container}>
          <Text>Fetch Asset and Checklist API</Text>
          <Text>Asset Category:
            {JSON.stringify(this.state.Checklist[3])}</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AssetScreen;
