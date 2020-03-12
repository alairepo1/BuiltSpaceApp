import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, FlatList, ShadowPropTypesIOS} from 'react-native';
import { ButtonGroup } from 'react-native-elements';

export class MaterialsType extends Component {
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
            buttons.push({element:  () => <Text style={{width: '100%', height: '100%', color : this.state.colors[index]}}>{button}</Text>})
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
                selectMultiple={false}
                buttons={buttonArray}
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                underlayColor={'red'}
                />

                <View style={{flex: 2, flexDirection: "row"}}>
                <View style={{flex:2}}>
                    <Text style={{leftmargin: 5}}>{this.props.question.item.measurementlabel}</Text>
                    <TextInput 
                    style={{ flex: 1, margin: 4, height: 40, backgroundColor: 'lightgray', borderWidth: 1 }}
                    // value={} // use a value from the parent.
                    />
                </View>

                <View style={{flex:2}}>
                    <Text style={{leftmargin: 5}}>Unit Cost</Text>
                    <TextInput 
                    style={{ flex:1, margin: 4, height: 40, backgroundColor: 'lightgray', borderWidth: 1 }}
                    label="Unit Cost"
                    // value={} // use a value from the parent.
                    />
                </View>
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

export default MaterialsType