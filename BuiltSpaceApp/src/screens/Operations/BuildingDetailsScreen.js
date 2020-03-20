import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import StatusBar from '../../statusComponent.js';

export class BuildingDetailsScreen extends Component { 
    constructor(props) {
        super(props);
        this.state = {
          building_data: [],
          key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U='
        };
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
    const buildingName = navigation.getParam('buildingName', 'None');
    const buildingCity = navigation.getParam('buildingCity', 'None');
    const buildingProvince =navigation.getParam('buildingProvince', 'None');
    const buildingAddress= navigation.getParam('buildingAddress', 'None');
    const buildingPostalCode = navigation.getParam('buildingPostalCode', 'None');
    const buildingId = navigation.getParam('buildingId', 'None');
    const orgData = this.props.navigation.getParam('orgData','None')
    const buildingData = this.props.navigation.getParam('buildingData', 'None')
    return (

    <View style={styles.container}>
      <StatusBar/>
        <Text style={styles.detailsTextContainer}>
            <Text style={styles.detailsTextBold}>City: <Text style={styles.detailsText}>{buildingCity} {'\n\n'}</Text></Text>
            <Text style={styles.detailsTextBold}>Address: <Text style={styles.detailsText}>{buildingAddress}, {buildingCity}, {buildingProvince} {'\n\n'}</Text></Text>
            <Text style={styles.detailsTextBold}>Postal Code: <Text style={styles.detailsText}>{buildingPostalCode} </Text></Text>
        </Text>
      <FlatList style={styles.flatList}
      data={[{title: 'Start Visit',browse: 'Browse',qrcode: 'Scan Qr'}]}
      renderItem={({item}) => 
      <View>

      <TouchableOpacity onPress={() => this.props.navigation.navigate('ExploreBuilding')}>
        <View style={styles.row}>
            <Text style={styles.text}>{item.title}</Text>
        </View>  
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('ExploreBuilding', {
        buildingId: buildingId,
        orgData: orgData,
        buildingData: buildingData 
        
      })}>
      <View style={styles.row}>
          <Text style={styles.text}>{item.browse}</Text>
      </View>  
    </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
<<<<<<< Updated upstream
   flex: 1,
   marginTop: 20,
   backgroundColor: 'white',
=======
    flex: 1,
    marginTop: 20,
    backgroundColor: '#FAF9ED',
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
    marginBottom: 3,
    marginLeft: 15,
    marginTop: 15,
    marginRight: 15,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  text: {
    flex: 1,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
    
    
  },
  detailsTextContainer: {
      padding: 15
  },
  detailsTextBold: {
    flex: 1,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
   
  },
  detailsText: {
      color: 'black',
      fontWeight: 'normal',
      fontSize: 14,
      
  },
  flatList: {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      backgroundColor: '#324679',
=======
    backgroundColor: '#FAF9ED',
>>>>>>> Stashed changes
=======
    backgroundColor: '#FAF9ED',
>>>>>>> Stashed changes
  }
  
})

export default BuildingDetailsScreen;