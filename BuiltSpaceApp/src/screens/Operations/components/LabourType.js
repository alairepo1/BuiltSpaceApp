import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import { ButtonGroup } from 'react-native-elements';


export class LabourType extends Component {
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

    componentDidMount = () => {
        this.props.question.updateQuestion(this.props.question.index, 'Regular', "InspectionResults")
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
                        selectMultiple={question.allowmultiplechoices ? true : false}
                        buttons={buttonArray}
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        underlayColor={'red'}
                        />
                        :
                        <TextInput 
                        style={{ height: 40, margin: 4,  backgroundColor: 'lightgray', borderWidth: 1 }}
                        onChangeText={text => this.props.question.updateQuestion(
                            this.props.question.index, // index of the question
                            text, // text input
                            "TextOnly", // type 
                            )}
                        />)
                    :null}
                {question.showmeasurement 
                || question.measurementonly
                || question.questiontype === "Labour" ?
                    <View style={{flex:2}}>
                        {question.measurementlabel !== "" ?
                            <Text>{question.measurementlabel}</Text>
                            :
                            <Text>Measurement</Text>}

                        <View style={{flex: 2, flexDirection: 'row'}}>
                        <TextInput 
                        style={{ flex: 1, margin: 4, height: 40, backgroundColor: 'lightgray', borderWidth: 1 }}
                        onChangeText={text => this.props.question.updateQuestion(
                            this.props.question.index, // index of the question
                            text, // text input
                            "measurement", // type 
                            this.props.question.item.measurementlabel // measurement label
                            )}
                        />
                            <Text style={{marginTop: 10, marginLeft: 4}}>{question.measurementunit}</Text>
                        </View>
                    </View>
                    :null}
                <View style={{flex: 2, flexDirection: "row"}}>
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