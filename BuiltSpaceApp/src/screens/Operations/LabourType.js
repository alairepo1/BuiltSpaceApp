import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ListItem, ShadowPropTypesIOS} from 'react-native';
import {ButtonGroup} from 'react-native-elements';

export class LabourType extends Component{
    constructor(props) {
        super(props);
        this.state= {
            selectedIndex: 0,
            questionsData: this.props.question.item
        }
        
        this.updateIndex = this.updateIndex.bind(this)
    }
    
    updateIndex (selectedIndex) {
        this.setState({selectedIndex})
    }

    

    render() {
        const formatString = this.props.question.item.format.split("|")
        const question = this.props.question.item
        const buttons = formatString
        const { selectedIndex } = this.state
        console.log(this.props.question.item)
        console.log(formatString)
        return (
            <View>
                <Text>{this.state.questionsData.checklisttitle}</Text>
                <Text>{this.state.questionsData.question}</Text>
                {/* {!question.measurementonly ? 
                <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={styles.button}
                />
                :(question.measurementlabel == '' ? 
                <View>
                   <Text style={{leftmargin: 5}}>Measurement</Text>
                    <TextInput 
                    style={{ flex:1, margin: 4, height: 40, backgroundColor: 'lightgray', borderWidth: 1 }}
                    /><Text>{question.measurementunit}</Text> 
                </View>
                : (!question.measurementlabel == '' ?
                <View>
                   <Text style={{leftmargin: 5}}>{question.measurementlabel}</Text>
                    <TextInput 
                    style={{ flex:1, margin: 4, height: 40, backgroundColor: 'lightgray', borderWidth: 1 }}
                    /><Text>{question.measurementunit}</Text> 
                </View>
                : <Text>No buttons</Text>
                    )
                )
            } */}
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