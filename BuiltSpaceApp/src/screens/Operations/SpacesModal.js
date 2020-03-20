import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet, Text, View, Button, Modal, TouchableOpacity, FlatList} from 'react-native';

export class SpacesModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spaces: [],
            spacesFetched: false,
            key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
            modalVisible: false,
            isSelected: false,
            selection: ""
            
        }
    this.setModalVisible = this.setModalVisible.bind(this)
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    render() {
        const noneSelected = <Text style={styles.detailsText}>None Selected </Text>
        const selected = <Text style={styles.detailsTextSelected}>{this.state.selection} </Text>
        return(
            <View style={{marginTop: 22}}>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={{marginTop: 22}}>
                  <Text style={styles.headingTextBold}>Hello World!</Text>
                <FlatList
                data={this.props.spaces}
                renderItem = {({item}) =>
                  <TouchableOpacity
                    onPress={() => {
                    this.props.spacesFilter(item.floor)
                      this.setModalVisible(!this.state.modalVisible)
                      this.setState({
                          isSelected: true,
                          selection: item.floor
                      })
                    }}>
                    <View>
                        <Text>{item.floor}</Text>
                        <Text>{item.id}</Text>
                    </View>
                  </TouchableOpacity>
                }
                keyExtractor={item => item.id}
                ></FlatList>
                <TouchableOpacity
                onPress={() => {
                    this.setState({
                        isSelected: false
                    })
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                    <Text>Close</Text>
                </TouchableOpacity>
              </View>
            </Modal>
    
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true);
              }}>
            <View>
              <Text style={styles.headingTextBold}> Space</Text>
              {this.state.isSelected ? selected : noneSelected}
            </View>
            </TouchableOpacity>
          </View>
        )
    }
}

const styles = StyleSheet.create({
<<<<<<< Updated upstream
  

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
      backgroundColor: '#324679',
    }
  
    
  })
  
  export default SpacesModal;
=======


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
>>>>>>> Stashed changes
