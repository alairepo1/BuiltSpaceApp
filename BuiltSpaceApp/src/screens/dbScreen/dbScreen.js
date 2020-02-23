import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {acc} from 'react-native-reanimated';
import { insertNewAccount, updateAccount, delete_db,
        checkAccountExists, dbGetInfo,
        checkDBExists, delete_acc, checklists,
        buildings, insertOrgData} from '../../storage/schema/dbSchema'
import {trigger_new_account,fetchOrgs, get_org_data, get_building_data} from '../../storage/fetchAPI'

class RealmDB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: { // fetch account details email, id, key
        api_key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=', //Key is recieved when logged in
        org: 'bcitproject', // default org
        id: 200, // 
        email: 'TEST@gmail.com', 
      },
      realm: null,
      url: 'https://beta.builtspace.com',
      isLoading: true,
      api_organization: [],
      exampleData: [],
      network: false
    };
  }

  componentDidMount = async() => {
    /** Check if there is account logged in and fetch data.
     * If account does not exist, creates it in db.
    **/ 
   var info = await fetchOrgs(this.state.account)
   this.setState({
     api_organization: info[0],
     isLoading: false
   })
   
    if (!checkDBExists()){
      console.log("DB created")
    } 
    // else {
    //   if (checkAccountExists(this.state.account) === 'true'){
    //     //  get from db instead of fetchAPI
    //     console.log('account exists')
    //    } else {
    //     //  prompt add account into database?
    //     // var info = await trigger_new_account(this.state.account)
    //     console.log('account does not exist in db')
    //    }
    // }
  };

  get_account = async() => {
    let info = await dbGetInfo(this.state.account).then(result => {
      this.setState({exampleData: result})
     })
    //  console.log(JSON.stringify(this.state.exampleData,null,1))
  }

  get_org_data = async () => {
    
    let info = await get_org_data(this.state.api_organization, this.state.account.api_key).then(result => {
      insertOrgData(this.state.account, result)
      this.setState({api_organization : result})
      // let newdata = insertOrgData(this.state.account, result)

    })
    
  };

  get_buildings = () => {
    // get org_data before buildings
    // var info = get_building_data(this.state.api_organization[0],this.state.api_organization[0].buildings[0]);
    // console.log(info)
    this.setState({exampleData: this.state.api_organization.buildings})
  };

  update_db = () => {
    insertNewAccount(this.state.account, this.state.api_organization);
  };
  delete = () => {
    delete_db()
  };
  
  changeNetwork = () => {
    this.setState({network: true})
  }

  del_acc = () => {
    delete_acc(this.state.account)
  }

  render() {
    console.log(this.state.exampleData)
    const info = this.state.api_organization
      ? 'Organizations: ' + JSON.stringify(this.state.api_organization, null, 1)
      : 'Loading...';
    const offlineData = this.state.exampleData
      ? this.state.exampleData
      : 'Loading...'
    const have_network = <View style={styles.container}>
                          <ScrollView>
                            <Text>{JSON.stringify(this.state.api_organization, null, 1)}</Text>
                          </ScrollView>
                        </View>

    const no_network = <View style={styles.container}>
                          <FlatList
                            style={styles.flatlist}
                            data={offlineData}
                            extraData={offlineData}
                            renderItem={({item}) => 
                            <View>
                              <Text>{item.id}</Text>
                              <Text>{item.name}</Text>
                            </View>
                          }
                          keyExtractor={item => item.id}
                          />
                        </View>

    return this.state.isLoading ? (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text>Loading...</Text>
      </View>
    ) : (
      <View style={styles.container}>
        {this.state.network ? have_network: no_network }
      

        <View style={styles.container}>
          <View style={styles.bottom_buttons}>
            <View style={styles.other_buttons}>
              <Text>Other Buttons</Text>
              <TouchableOpacity style={styles.button} onPress={() => {this.changeNetwork()}}>
                <Text>toggle network</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => console.log(this.props)}>
                <Text>Home Screen</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {this.get_account()}}>
                <Text>Get account info</Text>
              </TouchableOpacity>
            </View>

              <View style={styles.db_buttons}>
                <Text>DbB buttons</Text>
                  <TouchableOpacity style={styles.button} onPress={() => {this.get_org_data()}}>
                    <Text>get org_data</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => {this.delete()}}>
                    <Text>Del DB</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => {this.del_acc()}}>
                    <Text>Del account</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}onPress={() => {this.update_db();}}>
                    <Text>Update Db</Text>
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
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  bottom_buttons: {
    flex: 1,
    flexDirection: 'row'
  },
  other_buttons: {
    flex: 1
  },
  db_buttons: {
    flex: 1
  },
  button: {
    backgroundColor: 'lightgrey',
    padding: 5,
    margin: 5,
  },
  flatlist: {
    backgroundColor: 'lightgrey',
    },
});

export default RealmDB;
