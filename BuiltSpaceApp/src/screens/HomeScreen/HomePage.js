import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import StatusBar from '../../statusComponent.js';
import {fetchOrgs} from '../../storage/fetchAPI';
import {
  insertNewAccount,
  checkAccountExists,
  checkDBExists,
  getAccountOrgs,
  updateOrgs
} from '../../storage/schema/dbSchema';

export class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Store user api key for reuse here?
      account: {
        api_key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
        email: 'bcitbuiltspace@gmail.com',
        id: 400,
      },
      connection_status: 'Not implemented',
      organizations: [],
      isLoading: true,
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
    checkDBExists();
    await checkAccountExists(this.state.account).then(response => {
      if (response){
        getAccountOrgs(this.state.account).then(result => {
          if (result.lastUpdated !== undefined) {
    
            //get datetime of last updated organizations
            //and add 1 hour to last updated time
            var addHour = result.lastUpdated
            addHour.setHours(addHour.getHours() + 1 )
    
            //current datetime
            var currentDate = new Date()
    
            // Check if org data last updated is past 1 hr
            if (currentDate < addHour) {
              console.log('Home load from database.')
              var orgs = Array.from(result.organizations);
              this.setState({
                organizations: orgs,
                isLoading: false,
              });
            }
          // Check if org data last updated is past 1 hr
          // Should check connection before refetching data from API
            if (currentDate >= addHour) {
              fetchOrgs(this.state.account).then(result => {
                console.log('Home: fetchorgs api call')
                updateOrgs(this.state.account, result)
                this.setState({
                  organizations: result,
                  isLoading: false,
                });
              });
            }
          } else {
            fetchOrgs(this.state.account).then(result => {
              console.log('Home: no lastupdated fetchOrg call')
              updateOrgs(this.state.account, result)
              this.setState({
                organizations: result,
                isLoading: false,
              });
            });
          }
          
        }).catch(e => {console.log(e)});
      }
      if (!response){
        fetchOrgs(this.state.account).then(orgs =>{
          insertNewAccount(this.state.account, orgs)
          this.setState({
            organizations: orgs,
            isLoading: false
          })
        })
      }
    });



  };

  refreshData = () => {
    fetchOrgs(this.state.account).then(result => {
      updateOrgs(this.state.account, result)
      this.setState({
        organizations: result,
        isLoading: false,
      });
    });
  }

  render() {
    const {navigate} = this.props.navigation;
    return this.state.isLoading ? (
      <View>
        <ActivityIndicator />
        <Text>Loading...</Text>
      </View>
    ) : (
      <View style={styles.container}>
        <StatusBar />
        <Text style={styles.homePageText}>
          To Start please select an organization
        </Text>
        <View style={styles.button_view}>
          <View>
            <View style={styles.button_container}>
              <TouchableOpacity
                style={styles.buttons}
                onPress={() =>
                  this.props.navigation.navigate(
                    'Organization',
                    this.state.organizations,
                  )
                }>
                <Text style={styles.button_text}> Select organization</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    flex: 2,
    backgroundColor: '#ffffff',
=======
    // flex: 2,
>>>>>>> origin/merge-w-realm
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  homePageText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  button_view: {
    // flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#324679',
    marginTop: 15,
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
    marginTop: 13,
  },
});

export default HomePage;
