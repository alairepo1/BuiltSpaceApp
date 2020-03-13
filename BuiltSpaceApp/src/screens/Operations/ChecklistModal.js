import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SearchBar } from 'react-native-elements';
import { Image, StyleSheet, Text, View, Button, Modal, TouchableOpacity, FlatList, Alert } from 'react-native';
import  ChecklistIcon from 'react-native-vector-icons/Foundation'

export class ChecklistModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checklists: [],
			checklistsFetched: false,
			key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
			modalVisible: false,
			checklistIsSelected: false,
			checklistSelection: "",

		}
		this.setModalVisible = this.setModalVisible.bind(this)
		this.arrayholder = [];
	}
	setModalVisible(visible) {
		this.setState({ modalVisible: visible });
  }

  searchFilterFunction = text => {
		this.setState({
			value: text,
		});
		const newData = this.arrayholder.filter(item => {
			const itemData = `${this.floor.toUpperCase()}`;
			const textData = text.toUpperCase();

			return itemData.indexOf(textData) > -1;
		});
		this.setState({
			checklists: newData,
		});

  };
  
	renderHeader = () => {
		return (
			<SearchBar
				placeholder="Search"
				lightTheme
				round
				onChangeText={text => this.searchFilterFunction(text)}
				autoCorrect={false}
				value={this.state.value}
			/>
		);
	};

	render() {

		const selected = <View style={styles.textContainerSelected}>
			<View>
				<Text style={styles.optionText}> Checklist</Text>
				<Text style={styles.detailsTextSelected}>{this.state.checklistSelection} </Text>
			</View>
		</View>

		const noneSelected = <View style={styles.textContainer}>
			<View>
				<Text style={styles.optionText}> Checklist</Text>
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
						this.setModalVisible(!this.state.modalVisible)
					}}>
					<View style={{ marginTop: 22 }}>
						<FlatList
							data={this.props.checklists}
							renderItem={({ item }) =>
								<TouchableOpacity
									onPress={() => {
										this.props.loadQuestions(item.questions)
										this.setModalVisible(!this.state.modalVisible)
										this.setState({
											checklistIsSelected: true,
											checklistSelection: item.title
										})
										console.log(this.state.checklistSelection)
									}}>
									<View>
										<Text style={{ fontWeight: 'bold', fontSize: 22 }}>{item.title}</Text>
									</View>
								</TouchableOpacity>
							}
							keyExtractor={item => item.id}
							ListHeaderComponent={this.renderHeader}
						></FlatList>
						<TouchableOpacity
							onPress={() => {
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

					{this.state.checklistIsSelected ? selected : noneSelected}

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

export default ChecklistModal