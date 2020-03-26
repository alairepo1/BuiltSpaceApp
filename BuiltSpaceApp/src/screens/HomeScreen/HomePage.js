import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList, 
  ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import {ContextInfo} from '../../ContextInfoProvider';
import {fetchOrgs} from '../../storage/fetchAPI';
import {
  insertNewAccount,
  checkAccountExists,
  checkDBExists,
  getAccountOrgs,
  updateAccount,
  getInspections,
  delInspections
} from '../../storage/schema/dbSchema';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements'
import { useFocusEffect } from 'react-navigation';

export class HomePage extends Component {
  static contextType = ContextInfo
  constructor(props) {
    super(props);
    this.state = {
      // Store user api key for reuse here?
      accountlastUpdated: '',
      organizations: [],
      isLoading: true,
      inspectionsList: [],
      checked: [],
    };
  }

  componentDidMount = () => {
    const {navigation} = this.props
    this._focusListener = navigation.addListener('didFocus', payload => {
      //adds a listener check for transitions to the HomeScreen then reloads inspection data
      // this.loadInspections() 
      this.loadData()
    })
  };

  componentWillUnmount = () => {
    this._focusListener //removes the listener
  }

  loadData = async() => {
        // fetch data from api/db or update db
        var currentDate = new Date() // current datetime as object.

        checkDBExists(); // check if database exists, if not creates one.
        await checkAccountExists(this.context.accountContext.account).then(response => {
          if (response){
            getAccountOrgs(this.context.accountContext.account).then(result => {
              if (result.lastUpdated !== undefined) {
        
                //get datetime of last updated organizations
                //and add 1 hour to last updated time
                var addHour = result.lastUpdated
                addHour.setHours(addHour.getHours() + 1 )

                if (this.context.networkContext.isConnected) {

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
                  if (currentDate >= addHour && this.context.networkContext.isConnected) {
                    this.updateAccountData()
                  }
                } else{
                  console.log('No network, Home load from database.')
                  var orgs = Array.from(result.organizations);
                  this.setState({
                    accountlastUpdated: result.lastUpdated.toLocaleString(),
                    organizations: orgs,
                    isLoading: false,
                  });
                } 
                this.loadInspections() 
                // Check if org data last updated is past 1 hr
              } else {
                this.updateAccountData()
              }
              
            }).catch(e => {console.log(e)});
          }
          if (!response){
            fetchOrgs(this.context.accountContext.account).then(orgs =>{
              insertNewAccount(this.context.accountContext.account, orgs, currentDate)
              this.setState({
                accountlastUpdated: currentDate.toLocaleString(),
                organizations: orgs,
                isLoading: false,
                inspectionList: []
              })
            })
          }
        });
  }

  loadInspections = () => {
    /**
     * loads the inspections from the account
     */
    getInspections(this.context.accountContext.account).then(inspectionsList => {
      const toArray = Array.from(inspectionsList)
      const mappedObj = []
      toArray.forEach(inspection => {
        const insp = inspection
        insp['checked'] = false
        mappedObj.push(insp)
      }
        )
      this.setState({inspectionsList: mappedObj})
    })
  }

  updateAccountData = (currentDate) => {
    /**
     * updates the account's organization data
     */
    console.log("Home Screen update data")
    var currentDate = new Date() // current datetime as object
    fetchOrgs(this.context.accountContext.account).then(result => {
      updateAccount(this.context.accountContext.account, result, currentDate)
      this.setState({
        accountlastUpdated: currentDate.toLocaleString(),
        organizations: result,
        isLoading: false,
      });
    });
    this.loadInspections()
  }

  setCheckBox = (index) => {
    /**
     * checkboxes for the inspectionlist
     * changes the checkbox state based on the index of the flatlist item.
     */
      let data = [...this.state.inspectionsList];
      data[index].checked = !data[index].checked;
      this.setState({ data });
  }

  submitInspection = (accountDetails, inspections) => {
    /**
     * submits the inspection data that are selected
     * and deletes the records from the database once successfull.
     */

    {/**SUBMIT INSPECTIONS IS NOT IMPLEMENTED YET */} 

    /** Suedo code
     * HTTP post request with the list of inspection objects to BuiltSpace server.
     * On statusCode 200 in the callback, delete the inspections from the database.
     */
  }

  deleteInspection = (accountDetails, inspections) => {
    /**deletes the selected inspections from realm db and reloads the new inspection list*/
    delInspections(accountDetails, inspections)
    this.loadInspections()
  }
  
  confirmation = (buttonType) => {
    // On submit/delete inspection, will alert the user for confirmation.
    Alert.alert(
      'Confirmation',
      `${buttonType} selected inspections?`,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {
          if(buttonType == 'Delete'){
            this.deleteInspection(this.context.accountContext.account, this.state.inspectionsList)
          }
          if(buttonType == "Submit"){
            this.submitInspection(this.context.accountContext.account, this.state.inspectionsList)
          }
        } },
      ],
      { cancelable: true }
    )
  }

  render() {
    return this.state.isLoading ? (
      <View>
        <ActivityIndicator />
        <Text>Loading...</Text>
      </View>
    ) : (
      <View style={styles.container}>
        <Text>Connection status: {this.context.networkContext.isConnected ? 'online' : 'offline'}</Text>
        <Text>Logged in as: {this.context.accountContext.account.email}</Text>
        <Text>Account last updated on: {this.state.accountlastUpdated}</Text>           
        <Icon  onPress={() => this.updateAccountData()} style={styles.listIcon} name="refresh" size={20} color="black" />

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
            <TouchableOpacity
                style={styles.buttons}
                onPress={() =>
                  {
                  this.context.accountContext.setAccount({})
                  this.props.navigation.navigate('Auth')
                }
                }>
                <Text style={styles.button_text}> Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={styles.inspectionContainer}>
              <Text>Saved inspections</Text>
              {this.state.inspectionsList.length > 0 ? 
              <ScrollView>
                <FlatList 
                data={this.state.inspectionsList}
                extraData={this.state}
                renderItem={({ item, index }) =>
                      <CheckBox 
                        style={styles.checkbox}
                        title={item.Name}
                        checked={this.state.inspectionsList[index].checked}
                        onPress={() => {this.setCheckBox(index)}
                        }
                        />
                }
                keyExtractor={item => item.Id}
                />
                              <View style={styles.inspectionButtonContainer}>
              <TouchableOpacity 
              onPress={() => { this.confirmation("Submit") }}
              style={styles.submit}>
                <Text>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity 
              onPress={() => { this.confirmation("Delete") }}
              style={styles.delete}>
                <Text>Delete</Text>
              </TouchableOpacity>
              </View>
              </ScrollView>
              :
              <Text>No unsubmitted work</Text>
              }

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
    color: 'black',
  },
  button_view: {
    // flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#FAF9ED',
    marginTop: 15,
  },
  button_container: {
    width: 240,
    alignSelf: 'center',
    margin: 10,
  },
  buttons: {
    backgroundColor: '#ABA9A9',
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
  inspectionContainer: {
    alignSelf: 'center',
    width: '100%',
    margin: 5
  },
  inspectionRow: {
    flex: 2,
    flexDirection: 'row',
  },
  checkbox: {
    flex: 1
  },
  inspectionButtonContainer: {
    flexDirection: 'row',
    marginLeft: 15
  },
  inspectionName: {
    flex: 1,
    fontSize: 15
  },
  submit:{
    width: 100,
    height: 40,
    padding: 10,
    margin: 5,
    backgroundColor: '#6CD938',
  },
  delete:{
    width: 100,
    height: 40,
    padding: 10,
    margin: 5,
    backgroundColor: 'red',
  },

});

export default HomePage;
