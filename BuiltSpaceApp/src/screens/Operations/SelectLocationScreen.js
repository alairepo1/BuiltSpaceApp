import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { NetworkContext } from '../../statusComponent.js';

export class SelectLocationScreen extends Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      location_data: [],
      key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U='
    };
  }

  componentDidMount = () => {
    this.fetch();
  };

  fetch = () => {
    fetch(
        'https://beta.builtspace.com/sites/bcitproject/_vti_bin/wcf/orgdata.svc/buildings',
        {
          method: 'get',
          headers: {
            Authorization: this.state.api_key,
          },
        },
    )
        .then(response => response.json())
        .then(result => {
          this.setState({
            location_data: result
          });
        })
        .catch(e => {
          console.log(e);
        });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>
          Load Org data with a flat list, flat list will have a button to select
          building and goto next screen.
        </Text>
      </View>
    );
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

export default SelectLocationScreen;
