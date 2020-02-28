import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import StatusBar from '../../statusComponent.js';
import SpacesModal from './SpacesModal.js';
import {get_building_data} from '../../storage/fetchAPI.js'
import AssetsModal from './AssetsModal.js'

export class ExploreBuildingScreen extends Component { 
    constructor(props) {
        super(props);
        this.state = {
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
      console.log(spaceFloor)
      this.state.filteredAssets = this.state.assets.filter(item => item.spaces === spaceFloor)
      console.log(this.state.filteredAssets)
    }

    assetsFilter = (assetCategory) => {
      console.log(assetCategory)
      this.state.filteredChecklist = this.state.checklists.filter(item => item.assetCategory === assetCategory || item.categoryabbr === "" )
      console.log(this.state.filteredChecklist)
    }
    
    componentDidMount = async() => {
      console.log("Befor")
      var orgData =  await this.props.navigation.state.params.orgData
      var buildingData = await this.props.navigation.state.params.buildingData
      var AssetsAndSpaces = await get_building_data(orgData, buildingData)
      console.log("Aye: ",orgData.checklists)
      this.setState({
        spaces: AssetsAndSpaces.spaces,
        assets: AssetsAndSpaces.assets,
        checklists: orgData.checklists,
        dataLoaded: true,
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