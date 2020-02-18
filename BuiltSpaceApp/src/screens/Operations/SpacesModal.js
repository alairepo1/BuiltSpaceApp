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
            modalVisible: false
            
        }
    // this.fetchSpaces = this.fetchSpaces.bind(this)
    this.setModalVisible = this.setModalVisible.bind(this)
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }

    // fetchSpaces = async() => {
    //     await fetch(
    //         `https://beta.builtspace.com/sites/bcitproject/_vti_bin/wcf/orgdata.svc/v2/spaces?buildingid=${this.props.buildingId}`, //gets spaces based om the building ID
    //         {
    //           method: 'get',
    //           headers: {
    //             Authorization: this.state.key
    //           },
    //         },
    //     ).then(response => response.json()
    //     ).then(results => {
    //         this.setState({
    //             spaces: results,
    //             spacesFetched: true
    //         })
    //     })
    // }
    componentDidMount = async() => {
        console.log('tst')
        // this.fetchSpaces()
        console.log('test')
        console.log(this.state.spaces)
        
    }

    render() {
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
                data={this.state.spaces}
                renderItem = {({item}) =>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <View>
                        <Text>{item.floor}</Text>
                        <Text>Hide Modal</Text>
                    </View>
                  </TouchableOpacity>
                }
                keyExtractor={item => item.id}
                ></FlatList>
              </View>
            </Modal>
    
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true);
              }}>
            <View>
              <Text style={styles.headingTextBold}> Space</Text>
              <Text style={styles.detailsText}>None Selected </Text>
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