import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, Button} from 'react-native';
import { ButtonGroup } from 'react-native-elements';


export class MaterialsType extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedIndex: 0,
            format: this.props.question.item.format.split('|'),
            colors: this.props.question.item.colorformat.split('|'),
            pictureArray: [],
            renderList: false
        }
    this.updateIndex = this.updateIndex.bind(this)
    this.buttonComponents = this.buttonComponents.bind(this)
    this.updatePictureArray = this.updatePictureArray.bind(this)
    }

    buttonComponents = () => {
        /**
         * takes the array of format and creates an array of text components
         * usable by the buttonGroup component
         */
        var buttons = []
        this.state.format.forEach((button,index) => {
            buttons.push({element:  () => <Text style={this.changeColor(index)}>{button}</Text>})
        })
        return buttons
    }

    changeColor = (index) => {
        /**
         * sets the color for each button in the buttonGroup and changes depending on 
         * the button index selected
         */
        if (this.state.selectedIndex == index) {
            return { borderColor: this.state.colors[index], color : 'white'}
        } else {
            return { borderColor: this.state.colors[index], color : this.state.colors[index]}
        }
        
    }

    updateIndex(selectedIndex) {
        /**
         * on buttonGroup select, it will set button that is pressed.
         */
        if (selectedIndex == this.state.selectedIndex){
            this.setState({selectedIndex: null})
            this.props.question.updateQuestion(this.props.question.index, "", "InspectionResults")

    updatePictureArray(uri) {
        const obj = {uri: `file://${uri[0]}`} 
       this.state.pictureArray.push(obj)
        console.log("Picture array:",this.state.pictureArray)
        console.log("URI: ", this.state.pictureArray[0].uri)
        this.setState({
            renderList: true
        })
    }

    render() {
        const buttonArray = this.buttonComponents()
        const { selectedIndex } = this.state
        const question = this.props.question.item
        return (
            <View style={{ backgroundColor: 'white', margin: 5, padding: 5 }}>
                <Text style={{fontWeight: "bold"}}>{question.question}</Text>
                {question.remarks !== "" ?
                <Text style={{fontStyle: "italic"}}>{question.remarks}</Text>
                : 
                null}
                {!question.measurementonly ?
                    (!question.textonly ? 
                        <ButtonGroup
                        selectedButtonStyle={{backgroundColor: this.state.colors[this.state.selectedIndex]}}
                        buttonStyle={{padding: 10}}
                        selectMultiple={false}
                        buttons={buttonArray}xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        />
                        :
                        <TextInput 
                        style={{ height: 40, margin: 4,  backgroundColor: 'lightgray', borderWidth: 1 }}
                        onChangeText={text => this.props.question.updateQuestion(
                            this.props.question.index, // index of the question
                            text, // text input
                            "TextOnly", // type 
                            )}
                        />
                        )
                    :
                    null}

                <View style={{flex: 2, flexDirection: "row"}}>
                {question.showmeasurement 
                || question.measurementonly
                || question.questiontype === "Labour" ?
                <View style={{flex:2}}>

                {question.measurementlabel !== "" ?
                        <Text>{question.measurementlabel}</Text>
                        :
                        <Text>Measurement</Text>}
                        <TextInput 
                        style={{ flex: 1, margin: 4, height: 40, backgroundColor: 'lightgray', borderWidth: 1 }}
                        onChangeText={text => this.props.question.updateQuestion(
                            this.props.question.index, // index of the question
                            text, // text input
                            "measurement", // type 
                            this.props.question.item.measurementlabel, // measurement label
                            )}
                        />
                </View>
                :
                null}
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
                <View style={{flex:1, margin: 5}}>
                        <Button
                            title="Upload picture"
                           onPress={() => this.props.navigation.navigate('CameraComponent', {
                                updatePictureArray: this.updatePictureArray
                            })}
                        ></Button>
                    
                    <FlatList style={{flex: 1}}
                    horizontal
                    style={{backgroundColor: 'white'}}
                    extraData={this.state.pictureArray}
                    data={this.state.pictureArray}
                    renderItem={({item}) =>
                    <View>
                    
                    <Image 
                    style={{width: 100, height: 100, marginRight: 5, marginTop: 5, overflow: 'hidden'}}
                    source={{ uri: item.uri}}></Image>
                    </View>
                    }
                    keyExtractor={item => this.state.pictureArray.indexOf(item)}
                    /> 
                    
                   </View>
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