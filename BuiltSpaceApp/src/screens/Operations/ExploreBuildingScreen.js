import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import StatusBar from '../../statusComponent.js';
import SpacesModal from './SpacesModal.js';
import {get_building_data} from '../../storage/fetchAPI.js'
import AssetsModal from './AssetsModal.js'
import {insertBuildingData, updateBuilding, DBcheckBuildingData} from '../../storage/schema/dbSchema'

export class ExploreBuildingScreen extends Component { 
    constructor(props) {
        super(props);
        this.state = {
          account: {
            api_key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
            email: 'bcitbuiltspace@gmail.com',
            id: 400,
          },
          building_data: [],
          key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
          spaces: [],
          spacesFetched: false,
          assets: [],
          filteredAssets: [],
          checklists: [],
          filteredChecklist: [],
          dataLoaded: false
        };
        this.spacesFilter = this.spacesFilter.bind(this)
      }

    spacesFilter = (spaceFloor) => {
      // console.log(spaceFloor)
      this.state.filteredAssets = this.state.assets.filter(item => item.spaces === spaceFloor)
      // console.log(this.state.filteredAssets)
    }

    assetsFilter = (assetCategory) => {
      // console.log(assetCategory)
      this.state.filteredChecklist = this.state.checklists.filter(item => item.assetCategory === assetCategory || item.categoryabbr === "" )
      // console.log(this.state.filteredChecklist)
    }
    
    componentDidMount = () => {
      // console.log("Befor")
      var orgData =  this.props.navigation.state.params.orgData // realm object
      var buildingData = this.props.navigation.state.params.buildingData //realm object
      this.setState({checklists: orgData.checklists}) //sets checklists

      DBcheckBuildingData(this.state.account, orgData, buildingData).then(result => {
        if (!result){
          get_building_data(orgData, buildingData, this.state.key).then(result => {
            console.log('get_building_data api call: ') 
            var building_data = result
            insertBuildingData(this.state.account, orgData.id,building_data)
            this.setState({
              spaces: result.spaces,
              assets: result.assets,
              dataLoaded: true,
            })
          })
        }else {
          if (result[0].lastUpdated !== undefined && result[0].lastUpdated !== null) {

            //get datetime of last updated organizations
            //and add 1 hour to last updated time
            var addHour = result[0].lastUpdated
            addHour.setHours(addHour.getHours() + 1 )
            
            //current datetime
            // var currentDateString = new Date().toISOString().replace('Z', '')
            var currentDate = new Date()

            // Check last updated timestamp is within 1 hour
            // if (currentDate < addHour) {
            //   console.log("ExploreBuildingScreen load from database: ")
            //   this.setState({
            //     spaces: result[0].spaces,
            //     assets: result[0].assets,
            //     dataLoaded: true
            //   })
            // }
    
            // Check network before fetching API
            // if (currentDate >= addHour) {
                get_building_data(orgData, buildingData, this.state.key).then(api_result => {
                  console.log("ExploreBulidingScreen refetch data 1 after hour")
                  var building_data = api_result
                  updateBuilding(this.state.account, orgData.id, building_data)
                  this.setState({
                    spaces: api_result.spaces,
                    assets: api_result.assets,
                    checklists: orgData.checklists,
                    dataLoaded: true,
                 })
                })
            // }

          }else{
            console.log('updatebuildings pls')
            get_building_data(orgData, buildingData, this.state.key).then(api_result => {
              console.log('get_building_data api call: ') 
              var building_data = api_result
              updateBuilding(this.state.account, orgData.id, building_data)
              this.setState({
                spaces: api_result.spaces,
                assets: api_result.assets,
                checklists: orgData.checklists,
                dataLoaded: true,
              })
            })
          }


        }

      })


    }

  // renderItem({item}) {
  //   return(
  //     <View style={styles.row}>
  //       <Text style={styles.text}>{item.address}</Text>
  //     </View>
      
  //   )
  // }

//   buildingAddress: item.name,
//         buildingCity: item.city,
//         buildingName: item.name,
//         buildingProvince: item.provincestate,
//         buildingPostalCode: item.postalcode

  render() {
    const {navigation} = this.props;
    
    const buildingId = navigation.getParam('buildingId', 'None')
    const buildingName = navigation.getParam('buildingName', 'None');
    if (!this.state.dataLoaded) {
      return(
        <Text>Loading</Text>
      )
    } else {
    return (
    <View>
      <StatusBar/>
      <View style={styles.TextContainer}>
            <SpacesModal spaces = {this.state.spaces} spacesFilter = {this.spacesFilter}/>
      </View>
      <View style={styles.TextContainer}>
        <AssetsModal assets = {this.state.assets} assetsFilter = {this.assetsFilter}/>
      </View>
      <View style={styles.TextContainer}>
        <TouchableOpacity>
            <Text style={styles.headingTextBold}> Checklist</Text><Text style={styles.detailsText}>None Selected </Text>
        </TouchableOpacity>     
      </View>
  <FlatList style={styles.flatList}
      data={[{qrcode: 'Scan Qr'}]}
      renderItem={({item}) => 
      <View>
    <TouchableOpacity >
    <View style={styles.row}>
        <Text style={styles.text}>{item.qrcode}</Text>
    </View>  
  </TouchableOpacity>
      </View>
      }
      keyExtractor={item => item.name}
      />
    </View>
      
      
    );
  }
}
}

const styles = StyleSheet.create({
  

  TextContainer: {
    padding: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRightColor: 'red',
    borderRightWidth: 50
  },
  headingTextBold: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
    alignSelf: 'flex-start'
    
  },
  detailsText: {
      color: 'red',
      fontWeight: 'normal',
      fontSize: 16,
      alignSelf: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
    marginBottom: 3,
    marginLeft: 15,
    marginTop: 170,
    marginRight: 15,
    borderBottomColor: 'white',
    borderBottomWidth: 2,
  },
  text: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
  },
  flatList: {
    backgroundColor: '#324679',
  }

  
})

export default ExploreBuildingScreen;