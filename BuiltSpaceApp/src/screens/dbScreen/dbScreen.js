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
        get_account, checkAccountExists, dbGetInfo,
        checkDBExists, delete_acc, checklists,
        buildings} from '../../../storage/schema/dbSchema'
import {trigger_new_account} from '../../../storage/fetchAPI'

class RealmDB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: { // fetch account details email, id, key
        key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=', //Key is recieved when logged in
        org: 'bcitproject', // default org
        id: 200, // 
        email: 'bcitproject@gmail.com', 
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
    if (!checkDBExists()){
      console.log("Create DB?")
      this.setState({
        api_organization: "DB not created",
        isLoading: false
      })
    } else {
      if (checkAccountExists(this.state.account)){
        //  get from db instead of fetchAPI
        //  var info = await trigger_new_account(this.state.account)
         this.setState({
           api_organization: info,
           isLoading: false
         })
       } else {
        //  prompt add account into database?
        var info = await trigger_new_account(this.state.account)
        this.setState({
          api_organization: info,
          isLoading: false
        })
       }
    }
  };

  get_info = () => {
    var info = dbGetInfo(this.state.account);
    console.log(this.state.exampleData)
    this.setState({info})
  };

  get_checklists = () => {
    var info = checklists(this.state.account);
    console.log(info)
    // this.setState({exampleData: info})
  };

  get_buildings = async () => {
    var info = await buildings(this.state.account);
    // console.log(info)
    this.setState({exampleData: info})
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
    const info = this.state.api_organization
      ? 'Organizations: ' + JSON.stringify(this.state.api_organization, null, 1)
      : 'Loading...';

    const have_network = <View style={styles.container}>
                          <ScrollView>
                            <Text>{JSON.stringify(this.state.api_organization, null, 1)}</Text>
                          </ScrollView>
                        </View>

    const no_network = <View style={styles.container}>
                          <FlatList
                            style={styles.flatlist}
                            data={this.state.exampleData}
                            extraData={this.state.exampleData}
                            renderItem={({item}) => 
                            <View>
                              <Text>{item}</Text>
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
            </View>

              <View style={styles.db_buttons}>
                <Text>DbB buttons</Text>
                  <TouchableOpacity style={styles.button} onPress={() => {this.get_info()}}>
                    <Text>get_info</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} disabled={true} onPress={() => {this.get_checklists()}}>
                    <Text>get checklists</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} disabled={true} onPress={() => {this.get_buildings()}}>
                    <Text>get buildings</Text>
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
    flex: 3,
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
