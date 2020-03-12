import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ListItem, ShadowPropTypesIOS} from 'react-native';
import { ButtonGroup } from 'react-native-elements';


export class LabourType extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedIndex: '',
            format: this.props.question.item.format.split('|'),
            colors: this.props.question.item.colorformat.split('|'),
        }
    this.updateIndex = this.updateIndex.bind(this)
    this.buttonComponents = this.buttonComponents.bind(this)
    }

    buttonComponents = () => {
        var buttons = []
        this.state.format.forEach((button,index) => {
            buttons.push({element:  () => <Text style={{width: '100%', height: '100%',color : this.state.colors[index]}}>{button}</Text>})
        })
        return buttons
    }
    
    updateIndex(selectedIndex) {
        this.setState({selectedIndex})
    }

    render() {
        const buttonArray = this.buttonComponents()
        const { selectedIndex } = this.state

        return (
            <View style={{ backgroundColor: 'white', margin: 5, padding: 5 }}>
                <Text style={{fontWeight: "bold"}}>{this.props.question.item.question}</Text>
                <ButtonGroup
                buttonStyle={{padding: 10}}
                selectMultiple={false}
                buttons={buttonArray}
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                underlayColor={'red'}
                />

                <View style={{flex: 2, flexDirection: "row"}}>
                </View>
                <View style={{flex:2}}>
                    <Text>Details: </Text>
                    <TextInput 
                    style={{ height: 40, margin: 4,  backgroundColor: 'lightgray', borderWidth: 1 }}
                    label="Details:"
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
        justifyContent: 'center',
        width: '100%',
        height: 40,
        marginLeft: 1,
        

        }
    })

export default LabourType