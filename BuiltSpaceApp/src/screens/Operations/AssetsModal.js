import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SearchBar } from 'react-native-elements';
import {Image, StyleSheet, Text, View, Button, Modal, TouchableOpacity, FlatList, Alert} from 'react-native';
import ChecklistIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export class AssetsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: [],
      assetsFetched: false,
      modalVisible: false,
      isSelected: false,
      selection: ""

    }
    this.setModalVisible = this.setModalVisible.bind(this)
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  searchFilterFunction = text => {
    this.setState({
      value: text,
    });
      const newData = this.props.assets.filter(item => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      assets: newData,
    });

  };
  renderHeader = () => {
    return (
      <View>
        <SearchBar
          placeholder="Search"
          lightTheme
          round
          onChangeText={text => this.searchFilterFunction(text)}
          autoCorrect={false}
          value={this.state.value}
        />
        <TouchableOpacity  style={styles.assetListItems} onPress={() => {
          this.props.onAssetChange(false, '', 'asset')
          this.setModalVisible(!this.state.modalVisible)
          }}>
          <Text style={styles.listText}>Select None</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const selected = <View style={styles.textContainerSelected}>
      <View>
        <Text style={styles.optionText}> Assets</Text>
        <Text style={styles.detailsTextSelected}>{this.props.assetTitle} </Text>
      </View>
    </View>

    const noneSelected = <View style={styles.textContainer}>
      <View>
        <Text style={styles.optionText}> Assets</Text>
        <Text style={styles.detailsText}>None Selected </Text>
      </View>
    </View>

    return (
      <View style={{ marginTop: 22 }}>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
            
          <View style={styles.listContainer}>
            <View style={styles.titleTop}>
              <Text style={styles.headingTextBold}>Select an Asset</Text>
            </View>
            <FlatList style={{ marginTop: 20, marginBottom: 75 }}
              data={this.props.assets}
              renderItem={({ item }) =>
                <TouchableOpacity
                  onPress={() => {
                    this.props.assetsFilter(item)
                    this.props.onAssetChange(true, item.name, 'asset')
                    this.setModalVisible(!this.state.modalVisible)
                  }}>
                  <View style={styles.assetListItems}>
                    <View style={styles.listIconContainer}>
                      <ChecklistIcon style={styles.listIcon} name="fan" size={50} color="black" />
                      <View >
                        <Text style={styles.listText}>Name: {item.name}</Text>
                        <Text style={styles.listText}>Serial: {item.serial}</Text>
                        <Text style={styles.listText}>Model: {item.model}</Text>
                        <Text style={styles.listText}>Make: {item.make}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              }
              keyExtractor={item => item.id}
              ListHeaderComponent={this.renderHeader}
            ></FlatList>

            {/* Bottom clos button container */}
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>

        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}>

          {this.props.assetSelected ? selected : noneSelected}

        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({


  textContainer: {
    padding: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRightColor: 'red',
    borderRightWidth: 50
  },
  textContainerSelected: {
    padding: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRightColor: 'green',
    borderRightWidth: 50
  },
  optionText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30
  },
  titleTop: {
    backgroundColor: '#FAF9ED',
    width: '100%',
    height: 50
  },
  headingTextBold: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
    alignSelf: 'center'

  },
  detailsText: {
    color: 'red',
    fontWeight: 'normal',
    fontSize: 16,
    alignSelf: 'center'
  },
  detailsTextSelected: {
    color: 'green',
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
    backgroundColor: '#FAF9ED',
  },
  assetListItems: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ABA9A9',
  },
  listContainer: {
    marginTop: 10,
    flex: 1,
  },
  bottomContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#FAF9ED',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  listText: {
    justifyContent: 'flex-start',
    fontSize: 15,
    padding: 2
  },
  closeButton: {
    textAlign: "center",
    color: 'white',
    fontSize: 25,
  },
  listIcon: {
    paddingRight: 15,
    paddingLeft: 10
  },
  listIconContainer: {
    paddingVertical: 10,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center"
  }


})

export default AssetsModal;
