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
import { NetworkContext } from '../../networkProvider';
import {fetchOrgs} from '../../storage/fetchAPI';
import {
  insertNewAccount,
  checkAccountExists,
  checkDBExists,
  getAccountOrgs,
  updateAccount,
  delete_db
} from '../../storage/schema/dbSchema';
import Icon from 'react-native-vector-icons/FontAwesome';

export class HomePage extends Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      // Store user api key for reuse here?
      account: {
        api_key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
        email: 'bcitbuiltspace@gmail.com',
        id: 400,
      },
      lastUpdated: '',
      organizations: [],
      isLoading: true,      
    };
  }

  componentDidMount = async() => {
    // fetch data from api/db or update db

    var currentDate = new Date() // current datetime as object.

    checkDBExists(); // check if database exists, if not creates one.
    await checkAccountExists(this.state.account).then(response => {
      if (response){
        getAccountOrgs(this.state.account).then(result => {
          if (result.lastUpdated !== undefined) {
    
            //get datetime of last updated organizations
            //and add 1 hour to last updated time
            var addHour = result.lastUpdated
            addHour.setHours(addHour.getHours() + 1 )

    
            // Check if org data last updated is past 1 hr
            if (currentDate < addHour) {
              console.log('Home load from database.')
              var orgs = Array.from(result.organizations);
              this.setState({
                accountlastUpdated: result.lastUpdated.toLocaleString(),
                organizations: orgs,
                isLoading: false,
              });
            }
          // Check if org data last updated is past 1 hr
          // Should check connection before refetching data from API
            if (currentDate >= addHour && this.context.isConnected) {
              this.updateAccountData()
            }
          } else {
            this.updateAccountData()
          }
          
        }).catch(e => {console.log(e)});
      }
      if (!response){
        fetchOrgs(this.state.account).then(orgs =>{
          insertNewAccount(this.state.account, orgs, currentDate)
          this.setState({
            accountlastUpdated: currentDate.toLocaleString(),
            organizations: orgs,
            isLoading: false
          })
        })
      }
    });
  };

  updateAccountData = (currentDate) => {
    console.log("Home Screen update data data")
    var currentDate = new Date() // current datetime as object
    fetchOrgs(this.state.account).then(result => {
      updateAccount(this.state.account, result, currentDate)
      this.setState({
        accountlastUpdated: currentDate.toLocaleString(),
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
        <Text>Connection status: {this.context.isConnected ? 'online' : 'offline'}</Text>
        <Text>Logged in as: {this.state.account.email}</Text>
        <Text>Account last updated on: {this.state.accountlastUpdated}</Text>           
        <Icon onPress={() => this.updateAccountData()} style={styles.listIcon} name="refresh" size={20} color="white" />

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
            {/* <TouchableOpacity
                style={styles.buttons}
                onPress={() => delete_db()}>
                <Text style={styles.button_text}> Del DB </Text>
              </TouchableOpacity> */}
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
