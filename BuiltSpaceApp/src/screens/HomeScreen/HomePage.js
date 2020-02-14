import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import PropTypes from 'prop-types';
import StatusBar from '../../statusComponent.js';

export class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Store user api key for reuse here?
      api_key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
      email: '<fetch sign in email>',
      connection_status: 'Not implemented',
      organization: '<fetch selected org>',
    };
  }

  notImplemented = () => {
    Alert.alert(
      'Not Implemented',
      'Button is not implemented yet',
      [
        {
          text: 'Close',
          onPress: () => console.log('Not implemented'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  fetchAPI = () => {
    fetch(
      'https://beta.builtspace.com/_vti_bin/wcf/userdata.svc/MyOrganizations',
      {
        method: 'get',
        headers: {
          Authorization: this.state.api_key,
        },
      },
    )
      .then(response => response.json())
      .then(result => {
        // returns an array of organization objects
        // Implement a chooser that will set state to selected organization
        this.setState({
          organization: result[0].name,
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  componentDidMount = () => {
    // initialize the api here
    this.fetchAPI();
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.homePageText}>To Start please select an organization</Text>
        <View style={styles.button_view}>
          <View>
            <View style={styles.button_container}>
              <TouchableOpacity
                style={styles.buttons}
                onPress={() => this.props.navigation.navigate('Organization')}>
                <Text style={styles.button_text}> Select organization</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button_container}>
              <TouchableOpacity
                style={styles.buttons}
                onPress={() => this.props.navigation.navigate('Assets')}>
                <Text style={styles.button_text}> Select assets</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View >
            <View style={styles.button_container}>
              <TouchableOpacity
                style={styles.buttons}
                onPress={() => this.props.navigation.navigate('Auth')}>
                <Text style={styles.button_text}> Log Out </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  
  },
  homePageText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white'
  },
  button_view: {
    // flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#324679',
    marginTop: 15
  
  },
  button_container: {
    width: 240,
    alignSelf: 'center',
    margin: 10,
  },
  buttons: {
    backgroundColor: 'grey',
    margin: 5,
    color: 'black',
    height: 50,
  },
  button_text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 13
  },
});

export default HomePage;
