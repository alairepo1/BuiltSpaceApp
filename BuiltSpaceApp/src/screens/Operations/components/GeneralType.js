import React, {Component} from 'react';
import {Alert, View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, Button} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import CameraComponent from './CameraComponent.js'
import ImageEditor from "@react-native-community/image-editor";
import ImagePicker from 'react-native-image-crop-picker'
import * as RNFS from 'react-native-fs'

const dirPictures = `${RNFS.ExternalStorageDirectoryPath}/Pictures`

export class GeneralType extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedIndex: null,
            format: this.props.question.item.format.split('|'),
            colors: this.props.question.item.colorformat.split('|'),
            pictureArray: [],
            renderList: false
        }
    this.updateIndex = this.updateIndex.bind(this)
    this.buttonComponents = this.buttonComponents.bind(this)
    this.updatePictureArray = this.updatePictureArray.bind(this)
    this.cropPicture = this.cropPicture.bind(this)
    this.deletePicture = this.deletePicture.bind(this)
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
            return {textAlign: "center", borderColor: this.state.colors[index], color : 'white'}
        } else {
            return {textAlign: "center", borderColor: this.state.colors[index], color : this.state.colors[index]}
        }
        
    }
    
    updateIndex(selectedIndex) {
        if (selectedIndex == this.state.selectedIndex){
            this.setState({selectedIndex: null})
            this.props.question.updateQuestion(this.props.question.index, "", "InspectionResults")
        }else{
            this.setState({selectedIndex})
            this.props.question.updateQuestion(this.props.question.index, this.state.format[selectedIndex], "InspectionResults")

        }
    }

    updatePictureArray(uri) {
        const obj = {uri: `file://${uri[0]}`} 
        this.props.question.updateQuestion(this.props.question.index, obj, "Photos")
       this.state.pictureArray.push(obj)
       this.setState({
            renderList: true
        })
    }

    cropPicture(uri, index) {
        ImagePicker.openCropper({
            path: uri,
            width: 300,
            height: 400
          }).then(image => {
            console.log(image.path);
            console.log("Index:",index)
            const editedPics = [...this.state.pictureArray]
            editedPics[index] = {uri: image.path}
            this.props.question.updateQuestion(this.props.question.index, editedPics, "crop Photos")
            console.log("New array", editedPics)
            this.setState({ pictureArray: editedPics })
          });
          this.setState({
              renderList: true
          })
    }

    deletePicture(uri, index) {

        this.state.pictureArray.splice(index, 1)
        this.props.question.updateQuestion(this.props.question.index, index, "delete Photos")
        const filepath = `${uri}`
        console.log('filepath:', filepath)
        RNFS.exists(filepath)
        .then((result)=> {
            console.log('file exists:', result)
            if (result) {
                return RNFS.unlink(filepath)
                .then(() => {
                    console.log('File deleted')
                })
                // unlink will throw an error if the picture doesn't exist
                .catch((err) => {
                    console.log(err.message)
                })
            }
        })
        .catch((err) => {
            console.log(err.message)
        })
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
                <Text style={{fontWeight: "bold"}}>{question.number}. {question.question}</Text>
                {question.remarks !== "" ?
                <Text style={{fontStyle: "italic"}}>{question.remarks}</Text>
                : 
                null}
                {!question.measurementonly ?
                    (!question.textonly ? 
                        <ButtonGroup
                        selectedButtonStyle={{backgroundColor: this.state.colors[this.state.selectedIndex]}}
                        buttonStyle={{padding: 5}}
                        textStyle={{textAlign: "center"}}
                        selectMultiple={false}
                        buttons={buttonArray}
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        underlayColor={'red'}
                        />
                        :
                        <TextInput 
                        style={{ height: 40, margin: 4,  backgroundColor: 'lightgray', borderWidth: 1 }}
                        label="test"
                        />)
                    :
                    null}

                <View style={{flex: 2, flexDirection: "row"}}>
                {question.showmeasurement || question.measurementonly ?
                <View style={{flex:2}}>
                {question.measurementlabel !== "" ?
                        <Text>{question.measurementlabel}</Text>
                        :
                        <Text>Measurement</Text>}
                        <View style={{flex: 2, flexDirection: 'row'}}>
                            <TextInput 
                            style={{ height: 40, margin: 4,  backgroundColor: 'lightgray', borderWidth: 1 }}
                            onChangeText={text => this.props.question.updateQuestion(
                                this.props.question.index, // index of the question
                                text, // text input
                                "TextOnly", // type 
                                this.props.question.measurementunit
                                )}
                            />
                            <Text style={{marginTop: 10, marginLeft: 4}}>{question.measurementunit}</Text>
                        </View>
                </View>
                :
                null}
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
                    renderItem={({item, index}) =>
                    <TouchableOpacity onPress={() => {
                        Alert.alert(
                            'Edit Picture',
                            'Do you want to delete or crop this Picture?',
                            [
                              {text: 'Cancel', onPress: () => console.log('Cancel pressed'), style: 'cancel'},
                              {text: 'Crop Image', onPress: () => this.cropPicture(item.uri, index)},
                              {text: 'Delete Image', onPress: () => this.deletePicture(item.uri, index)},
                            ],
                            { cancelable: false }
                          )
                            }}>
                    <View>
                    
                    <Image
                    style={{width: 100, height: 100, marginRight: 5, marginTop: 5, overflow: 'hidden'}}
                    source={{ uri: item.uri}}></Image>
                    </View>
                    </TouchableOpacity>
                    }
                    keyExtractor={item => this.state.pictureArray.indexOf(item)}
                    /> 
                    
                   </View>
                   
            </View>
        )
    }
}

export default GeneralType