import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SearchBar } from 'react-native-elements';
import { Image, StyleSheet, Text, View, Button, Modal, TouchableOpacity, FlatList, Alert } from 'react-native';
import ChecklistIcon from 'react-native-vector-icons/MaterialCommunityIcons'


export class ChecklistModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            checklistIsSelected: false,
            
        }
		this.setModalVisible = this.setModalVisible.bind(this)
		this.arrayholder = [];
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }


    searchFilterFunction = text => {
      this.setState({
        value: text,
      });
      const newData = this.props.checklists.filter(item => {
        const itemData = `${item.title.toUpperCase()}`;
        const textData = text.toUpperCase();
  
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        checklists: newData,
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
        <TouchableOpacity  style={styles.checklistItems} onPress={() => {
          this.props.onChecklistChange(false, '', 'checklist')
          this.setModalVisible(!this.state.modalVisible)
          }}>
          <Text style={styles.listText}>Select None</Text>
        </TouchableOpacity>
      </View>
      );
    };

    render() {
        // const noneSelected = <Text style={styles.detailsText}>None Selected </Text>
        // const selected = <Text style={styles.detailsTextSelected}>{this.state.checklistSelection}</Text>

        const selected = <View style={styles.textContainerSelected}>
          <View>
            <Text style={styles.optionText}> Checklist</Text>
            <Text style={styles.detailsTextSelected}>{this.props.checklistTitle} </Text>
          </View>
        </View>
    
        const noneSelected = <View style={styles.textContainer}>
          <View>
            <Text style={styles.optionText}> Checklist</Text>
            <Text style={styles.detailsText}>None Selected </Text>
          </View>
        </View>

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
                  <Text style={styles.headingTextBold}>Select a Checklist</Text>
                </View>
                <FlatList style={{ marginTop: 20, marginBottom: 75}}
                data={this.state.checklists || this.props.checklists} 
                renderItem = {({ item }) =>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.loadQuestions(item.questions, item.title)
                      this.props.onChecklistChange(true, item.title, 'checklist')
                      this.setModalVisible(!this.state.modalVisible)
                    }}>
                    <View style={styles.checklistItems}>
                      <View style={styles.listIconContainter}>
                        <ChecklistIcon style={styles.listIcon} name="clipboard-text" size={50} color="black" />
                        <Text style={styles.listText}>Title: {item.title}</Text>
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
            <View>
              {this.props.checklistSelected ? selected : noneSelected}
            </View>
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
  checklistItems: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ABA9A9',
  },
  listContainer: {
    marginTop: 10,
    flex: 1,
  },
  listText: {
    justifyContent: 'flex-start',
    fontSize: 15,
    padding: 2
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
  closeButton: {
    textAlign: "center",
    color: 'black',
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

export default ChecklistModal