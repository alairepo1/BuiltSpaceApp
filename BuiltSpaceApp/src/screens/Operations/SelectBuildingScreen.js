import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { NetworkContext } from '../../statusComponent.js';
import {get_org_data} from '../../storage/fetchAPI.js'
import {insertOrgData, DBgetOrgData,DBcheckOrgData,updateOrgs} from '../../storage/schema/dbSchema'
import Icon from 'react-native-vector-icons/FontAwesome';

export class SelectBuildingScreen extends Component { 
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      account: {
        email: 'bcitbuiltspace@gmail.com',
        id: 400
      },
      org_data: [],
      key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
      isLoading: true
    };
  }

  componentDidMount = () => {
    // this.fetch();
    //API call to get org_data and update the database
    DBcheckOrgData(this.state.account,this.props.navigation.state.params.orgName).then(result => {
      // Error throws because it cannot find the object in DB due to deletion/updated in orgsupdate?
      if (!result){
        console.log("no data in org, fetching data...")
        get_org_data(this.props.navigation.state.params.orgName, this.state.key).then(result =>{
          console.log('no data in db, get_org_data')
          insertOrgData(this.state.account, result)
            this.setState({
              org_data: result,
              isLoading: false
            })
          })
      } else {
          if (result[0].lastUpdated !== undefined && result[0].lastUpdated !== null) {

            //get datetime of last updated organizations
            //and add 1 hour to last updated time
            var addHour = result[0].lastUpdated
            addHour.setHours(addHour.getHours() + 1 )
            
            //current datetime
            var currentDate = new Date()
            
            if (currentDate < addHour) {
              console.log('SelectBuildingScreeN: Fetch from database' + result[0].name)
              this.setState({
                org_data: result[0],
                isLoading: false
              })
            }
  
            if (currentDate >= addHour) {
              get_org_data(this.props.navigation.state.params.orgName, this.state.key).then(result =>{
                console.log("selectBuildingScreen fetch api and update by time", result.name)
                updateOrgs(this.state.account, result)
                  this.setState({
                    org_data: result,
                    isLoading: false
                  })
                })
            }
          } else {
            get_org_data(this.props.navigation.state.params.orgName, this.state.key).then(result =>{
              console.log("selectBuildingScreen fetch api and update")
              updateOrgs(this.state.account, result)
                this.setState({
                  org_data: result,
                  isLoading: false
                })
              })
          }
        
      }

    }).catch(e => {console.log(e)})
  };

  render() {
    const {building_data} = this.state;
    const {navigate} = this.props.navigation;

    return ( this.state.isLoading ? 
      <View>
        <Text>Loading</Text> 
      </View>
      :
      <FlatList style={styles.container}
      data={this.state.org_data.buildings}
      renderItem={({item}) => 
      <TouchableOpacity onPress={() => this.props.navigation.navigate('BuildingDetails', {
        buildingAddress: item.address,
        buildingCity: item.city,
        buildingName: item.name,
        buildingProvince: item.provincestate,
        buildingPostalCode: item.postalcode,
        buildingId: item.id,
        orgData: this.state.org_data,
        buildingData: item
      })}>
      <View style={styles.row}>
        <Text style={styles.text}>{item.name}</Text>
        <View>
        <Icon style={styles.listIcon}name="angle-right" size={30} color="white" />
      </View>
      </View>  
      
      </TouchableOpacity>
      }
      keyExtractor={item => item.name}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   marginTop: 40,
   marginLeft: 15,
   marginRight: 15,
   backgroundColor: '#324679',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
    marginBottom: 3,
    borderBottomColor: 'white',
    borderBottomWidth: 2,
  },
  text: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25
  },
  listIcon: {
    justifyContent: 'flex-end',
    textAlign:"right"
  },
  
})

export default SelectBuildingScreen;