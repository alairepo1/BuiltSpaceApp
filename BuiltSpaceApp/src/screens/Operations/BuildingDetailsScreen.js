import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {ContextInfo} from '../../ContextInfoProvider';
import styles from './BuildingScreen.style.js';

import Icon from 'react-native-vector-icons/FontAwesome';

export class BuildingDetailsScreen extends Component {
  static contextType = ContextInfo
  constructor(props) {
    super(props);
    this.state = {
      building_data: [],
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
      <View style={styles.buildingTopcontainer}>
        <Text style={styles.selectText}>Connection status: {this.context.networkContext.isConnected ? 'online' : 'offline'}</Text>
        <Text style={styles.selectText}>Logged in as: {this.context.accountContext.account.email}</Text>
      </View>
        <Text style={styles.detailsTextContainer}>
          <Text style={styles.detailsTextBold}>City: <Text style={styles.detailsText}>{buildingCity} {'\n\n'}</Text></Text>
          <Text style={styles.detailsTextBold}>Address: <Text style={styles.detailsText}>{buildingAddress}, {buildingCity}, {buildingProvince} {'\n\n'}</Text></Text>
          <Text style={styles.detailsTextBold}>Postal Code: <Text style={styles.detailsText}>{buildingPostalCode} </Text></Text>
        </Text>
        <FlatList style={styles.flatList}
          data={[{ title: 'Start Visit', browse: 'Browse', qrcode: 'Scan Qr' }]}
          renderItem={({ item }) =>
            <View>

              <TouchableOpacity onPress={() => console.log('not implemented yet')}>
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


export default BuildingDetailsScreen;