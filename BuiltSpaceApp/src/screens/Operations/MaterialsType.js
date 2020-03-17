import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, FlatList, ShadowPropTypesIOS} from 'react-native';
import { ButtonGroup } from 'react-native-elements';

export class MaterialsType extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedIndex: 0,
            format: this.props.question.item.format.split('|'),
            colors: this.props.question.item.colorformat.split('|'),
        }
    this.updateIndex = this.updateIndex.bind(this)
    this.buttonComponents = this.buttonComponents.bind(this)
    }

    buttonComponents = () => {
        var buttons = []
        this.state.format.forEach((button,index) => {
            buttons.push({element:  () => <Text style={this.changeColor(index)}>{button}</Text>})
        })
        return buttons
    }

    changeColor = (index) => {
        if (this.state.selectedIndex == index) {
            return { borderColor: this.state.colors[index], color : 'white'}
        } else {
            return { borderColor: this.state.colors[index], color : this.state.colors[index]}
        }
        
    }

    updateIndex(selectedIndex) {
        this.setState({selectedIndex})
        this.props.question.updateQuestion(this.props.question.index, this.state.format[selectedIndex], "InspectionResults")
    }

    render() {
        const buttonArray = this.buttonComponents()
        const { selectedIndex } = this.state
        return (
            <View style={{ backgroundColor: 'white', margin: 5, padding: 5 }}>
                <Text style={{fontWeight: "bold"}}>{this.props.question.item.question}</Text>
                <ButtonGroup
                selectMultiple={this.props.question.item.selectMultiple ? true : false}
                buttons={buttonArray}
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                selectedButtonStyle={{backgroundColor: this.state.colors[this.state.selectedIndex]}}
                />

                <View style={{flex: 2, flexDirection: "row"}}>
                <View style={{flex:2}}>
                    <Text style={{leftmargin: 5}}>{this.props.question.item.measurementlabel}</Text>
                    <TextInput 
                    style={{ flex: 1, margin: 4, height: 40, backgroundColor: 'lightgray', borderWidth: 1 }}
                    onChangeText={text => this.props.question.updateQuestion(
                        this.props.question.index, // index of the question
                        text, // text input
                        "measurement", // type 
                        this.props.question.item.measurementlabel // measurement label
                        )}
                    />
                </View>

                <View style={{flex:2}}>
                    <Text style={{leftmargin: 5}}>Unit Cost</Text>
                    <TextInput 
                    style={{ flex:1, margin: 4, height: 40, backgroundColor: 'lightgray', borderWidth: 1 }}
                    onChangeText={text => this.props.question.updateQuestion(
                        this.props.question.index, // index of the question
                        text, // text input
                        "UnitCost", // type 
                        )}
                    />
                </View>
                </View>
                <View style={{flex:2}}>
                    <Text>Details: </Text>
                    <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'lightgray', borderWidth: 1 }}
                    onChangeText={text => this.props.question.updateQuestion(
                        this.props.question.index, // index of the question
                        text, // text input
                        "TaskDetails", // type 
                        )}
                    />

                </View>
                <TouchableOpacity disabled={true} style={{ margin: 5, backgroundColor: 'white', width: 100, height: 20}}> 
                    <Text>Add picture</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width: '100%', 
        height: '100%', 
        padding: 2, 
        borderWidth: 1, 
    }
})

export default MaterialsType