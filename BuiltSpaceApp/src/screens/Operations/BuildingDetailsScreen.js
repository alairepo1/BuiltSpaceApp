import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { NetworkContext } from '../../networkProvider';

import Icon from 'react-native-vector-icons/FontAwesome';

export class BuildingDetailsScreen extends Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      building_data: [],
      key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U='
    };
  }
  
  render() {
    const { navigation } = this.props;
    const buildingName = navigation.getParam('buildingName', 'None');
    const buildingCity = navigation.getParam('buildingCity', 'None');
    const buildingProvince = navigation.getParam('buildingProvince', 'None');
    const buildingAddress = navigation.getParam('buildingAddress', 'None');
    const buildingPostalCode = navigation.getParam('buildingPostalCode', 'None');
    const buildingId = navigation.getParam('buildingId', 'None');
    const orgData = this.props.navigation.getParam('orgData', 'None')
    const buildingData = this.props.navigation.getParam('buildingData', 'None')
    return (

    <View style={styles.container}>
        <Text>Connection status: {this.context.isConnected ? 'online' : 'offline'}</Text>
        <Text style={styles.detailsTextContainer}>
          <Text style={styles.detailsTextBold}>City: <Text style={styles.detailsText}>{buildingCity} {'\n\n'}</Text></Text>
          <Text style={styles.detailsTextBold}>Address: <Text style={styles.detailsText}>{buildingAddress}, {buildingCity}, {buildingProvince} {'\n\n'}</Text></Text>
          <Text style={styles.detailsTextBold}>Postal Code: <Text style={styles.detailsText}>{buildingPostalCode} </Text></Text>
        </Text>
        <FlatList style={styles.flatList}
          data={[{ title: 'Start Visit', browse: 'Browse', qrcode: 'Scan Qr' }]}
          renderItem={({ item }) =>
            <View>

              <TouchableOpacity onPress={() => this.props.navigation.navigate('ExploreBuilding')}>
                <View style={styles.row}>
                  <Text style={styles.text}>{item.title}</Text>
                  <View>
                <Icon style={styles.listIcon} name="angle-right" size={30} color="white" />
              </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('ExploreBuilding', {
                buildingId: buildingId,
                orgData: orgData,
                buildingData: buildingData

              })}>
                <View style={styles.row}>
                  <Text style={styles.text}>{item.browse}</Text>
                  <View>
                <Icon style={styles.listIcon} name="angle-right" size={30} color="white" />
              </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity >
                <View style={styles.row}>
                  <Text style={styles.text}>{item.qrcode}</Text>
                  <View>
                <Icon style={styles.listIcon} name="angle-right" size={30} color="white" />
              </View>
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
    flex: 1,
    marginTop: 20,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
    marginBottom: 3,
    marginLeft: 15,
    marginTop: 15,
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
    backgroundColor: '#324679',
  }

})

export default BuildingDetailsScreen;