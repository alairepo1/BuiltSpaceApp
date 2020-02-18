import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import StatusBar from '../../statusComponent.js';
import {fetchOrgs} from '../../storage/fetchAPI'
export class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Store user api key for reuse here?
      account: {
        api_key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
        email: 'bcitbuiltspace@gmail.com',
        id: 200
      },
      connection_status: 'Not implemented',
      organizations: [],
      isLoading: true
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

  componentDidMount = async() => {
    // initialize the api here
    var org_data = await fetchOrgs(this.state.account)
    this.setState({
      organizations: org_data,
      isLoading: false
    })
    
  };

  render() {
    const {navigate} = this.props.navigation;
    return ( this.state.isLoading ? ( 
      <View>
        <ActivityIndicator/>
        <Text>Loading...</Text>
      </View>
     ) :( 
      <View style={styles.container}>
      <Text style={styles.homePageText}>To Start please select an organization</Text>
      <View style={styles.button_view}>
        <View>
          <View style={styles.button_container}>
            <TouchableOpacity
              style={styles.buttons}
              onPress={() => this.props.navigation.navigate('Organization', this.state.organizations)}>
              <Text style={styles.button_text}> Select organization</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View >
          <View style={styles.button_container}>
          <TouchableOpacity
              style={styles.buttons}
              onPress={() => this.props.navigation.navigate('dbScreen')}>
              <Text style={styles.button_text}> Database Screen </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttons}
              onPress={() => this.props.navigation.navigate('Auth')}>
              <Text style={styles.button_text}> Log Out </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
      )

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
