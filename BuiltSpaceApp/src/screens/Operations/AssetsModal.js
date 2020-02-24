import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet, Text, View, Button, Modal, TouchableOpacity, FlatList} from 'react-native';

export class AssetsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assets: [],
            assetsFetched: false,
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
                  <Text style={styles.headingTextBold}>Assets</Text>
                <FlatList
                data={this.props.assets}
                renderItem = {({item}) =>
                  <TouchableOpacity
                    onPress={() => {
                    this.props.assetsFilter(item.categoryabbr)
                      this.setModalVisible(!this.state.modalVisible)
                      this.setState({
                          isSelected: true,
                          selection: item.name
                      })
                    }}>
                    <View>
                        <Text style={{fontWeight: 'bold', fontSize: 22}}>Name: {item.name}</Text>
                        <Text>Description: {item.description}</Text>
                        <Text>Serial: {item.serial}</Text>
                        <Text>Category: {item.categoryabbr}</Text>
                        <Text>Model: {item.model}</Text>
                        <Text>Make: {item.make}</Text>
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
              <Text style={styles.headingTextBold}> Asset</Text>
              {this.state.isSelected ? selected : noneSelected}
            </View>
            </TouchableOpacity>
          </View>
        )
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
  
export default AssetsModal;