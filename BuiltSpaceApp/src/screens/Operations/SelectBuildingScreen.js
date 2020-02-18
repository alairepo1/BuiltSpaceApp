import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import StatusBar from '../../statusComponent.js';

export class SelectBuildingScreen extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      building_data: [],
      key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U='
    };
  }



  fetch = () => {
    fetch(
        'https://beta.builtspace.com/sites/bcitproject/_vti_bin/wcf/orgdata.svc/buildings', //get buildings
        {
          method: 'get',
          headers: {
            Authorization: this.state.key
          },
        },
    )
        .then(response => response.json())
        .then(result => {
          
          this.setState({
            building_data: result
          })
        })
        .catch(e => {
          console.log(e);
        });
  };

  componentDidMount = () => {
    this.fetch();
  };

  // renderItem({item}) {
  //   return(
  //     <View style={styles.row}>
  //       <Text style={styles.text}>{item.address}</Text>
  //     </View>
      
  //   )
  // }

  render() {
    const {building_data} = this.state;
    const {navigate} = this.props.navigation;
    return (
      <FlatList style={styles.container}
      data={this.state.building_data}
      renderItem={({item}) => 
      <TouchableOpacity onPress={() => this.props.navigation.navigate('BuildingDetails', {
        buildingAddress: item.address,
        buildingCity: item.city,
        buildingName: item.name,
        buildingProvince: item.provincestate,
        buildingPostalCode: item.postalcode,
        buildingId: item.id
      })}>
      <View style={styles.row}>
        <Text style={styles.text}>{item.name} </Text>
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
  }
  
})

export default SelectBuildingScreen;
