import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet, Text, View, Button, Modal, TouchableOpacity, FlatList, Alert} from 'react-native';

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
        const selected = <Text style={styles.detailsTextSelected}>{this.state.selection}</Text>
        return(
            <View style={{marginTop: 22}}>

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!this.state.modalVisible)
              }}>
              <View style={styles.listContainer}>
                <View style={styles.titleTop}>
                  <Text style={styles.headingTextBold}>Select an Asset</Text>
                </View>

                <FlatList style={{marginTop:30}}
                data={this.props.assets}
                renderItem = {({item}) =>
                  <TouchableOpacity
                    onPress={() => {
                    this.props.assetsFilter(item.categoryabbr)
                      this.setModalVisible(!this.state.modalVisible)
                      this.setState({
                          isSelected: true,
                          selection: item.name,
                      })
                    }}>
                    <View style={styles.assetListItems}>
                      <View style={{flex:1}}>
                        <Text style={styles.listTextLeft}>Name: {item.name}</Text>
                        <Text style={styles.listTextLeft}>Serial: {item.serial}</Text>
                        <Text style={styles.listTextLeft}>Model: {item.model}</Text>
                      </View>

                      <View style={{flex:1}}>
                        <Text style={styles.listTextRight}>Make: {item.make}</Text>
                        <Text style={styles.listTextRight}>Description: {item.categoryabbr}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                }
                keyExtractor={item => item.id}
                ></FlatList>
// <<<<<<< zach
//                 <TouchableOpacity
//                 onPress={() => {
//                     this.setModalVisible(!this.state.modalVisible);
//                   }}>
//                     <Text>Close</Text>
//                 </TouchableOpacity>
                
                {/* Bottom clos button container */}
                <View style={styles.bottomContainer}> 
                  <TouchableOpacity
                  onPress={() => {
                      this.setState({
                          isSelected: false
                      })
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
            <View>
              <Text style={styles.optionText}> Asset</Text>
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
    optionText: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 30
    },
    titleTop: {
      backgroundColor: '#324679',
      width: '100%',
      height: 50
    },
    headingTextBold: {
      color: 'white',
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
      backgroundColor: '#324679',
    },
    assetListItems :{
      padding: 15,
      flexDirection:"row",
      borderBottomWidth: 2
    },
    listContainer: {
      marginTop: 10,
      flex: 1,
    },
    bottomContainer: {
      width: '100%',
      height: 50,
      backgroundColor:'#324679',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute', 
      bottom: 0, 
    },
    listTextLeft: {
      justifyContent: 'flex-start',
      fontSize: 15,
    },
    listTextRight: {
      justifyContent: 'flex-end',
      fontSize: 15,
      textAlign:'right',
    },
    closeButton:{
      textAlign:"center",
      color: 'white',
      fontSize: 25,
    },
  
    
  })
  
export default AssetsModal