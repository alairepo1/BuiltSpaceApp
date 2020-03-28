import React, { Component } from 'react';
import {Text, View, Modal, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Location from 'react-native-vector-icons/SimpleLineIcons'
import { SearchBar } from 'react-native-elements';
import { set } from 'react-native-reanimated';



export class SpacesModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      spaces: this.props.spaces,
      spacesFetched: false,
      modalVisible: false,
      isSelected: false,
      selection: "",
      
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
    const newData = this.props.spaces.filter(item => {
      const itemData = `${item.floor.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      spaces: newData,
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
          this.props.onSpaceChange(false, '', 'space')
          this.setModalVisible(!this.state.modalVisible)
          }}>
          <Text style={styles.listText}>Select None</Text>
        </TouchableOpacity>
      </View>
    );
  };

  resetModal = () => {
    this.setState({ 
      value: '',
      modalIsOpen: false 
    }
  );
}
  render() {
  
    const selected = <View style={styles.textContainerSelected}>
      <View>
        <Text style={styles.optionText}> Space</Text>
        <Text style={styles.detailsTextSelected}>{this.props.spaceName} </Text>
      </View>
    </View>

    const noneSelected = <View style={styles.textContainer}>
      <View>
        <Text style={styles.optionText}> Space</Text>
        <Text style={styles.detailsText}>None Selected </Text>
      </View>
    </View>

    return (
      <View style={{ marginTop: 15, }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.resetModal()
            this.setModalVisible(!this.state.modalVisible);
          }}>

          <View style={styles.listContainer}>
            <View style={styles.titleTop}>
              <Text style={styles.headingTextBold}>Select a Space</Text>
            </View>

            <FlatList style={{ marginTop: 20, marginBottom: 75 }}
              data={this.state.spaces}
              renderItem={({ item }) =>
                <TouchableOpacity
                  onPress={() => {
                    this.props.spacesFilter(item)
                    this.setModalVisible(!this.state.modalVisible)
                    this.props.onSpaceChange('true', item.floor, 'space')
                  }}>
                  <View style={styles.assetListItems}>
                    <View style={styles.listIconContainer}>
                      <Location style={styles.listIcon} name="location-pin" size={30} color="black" />
                      <Text style={styles.listText}>{item.floor}</Text>
                    </View>
                    <View >
                      <Text style={styles.numAssets}>Assets: 3<Text> Floor: 01</Text></Text>
                    </View>

                  </View>


                </TouchableOpacity>
              }
              keyExtractor={item => item.id}
              ListHeaderComponent={this.renderHeader}
            ></FlatList>
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.resetModal()
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
          {this.props.spaceSelected ? selected : noneSelected}
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
    alignSelf: 'center',

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
  text: {
    flex: 1,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
  },
  flatList: {
    backgroundColor: '#FAF9ED',
  },
  assetListItems: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF9ED',
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
    fontSize: 15,
    paddingLeft: 5
  },
  numAssets: {
    justifyContent: 'center',
    textAlign: 'center'
  },
  closeButton: {
    textAlign: "center",
    color: 'black',
    fontSize: 25,
  },
  listIconContainer: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center"
  }


})

export default SpacesModal;