import React, {Component} from 'react';
import {ContextInfo} from '../../ContextInfoProvider';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import {get_building_data} from '../../storage/fetchAPI.js'
import SpacesModal from './SpacesModal.js';
import AssetsModal from './AssetsModal.js'
import {updateBuilding, DBcheckBuildingData} from '../../storage/schema/dbSchema'
import ChecklistModal from './ChecklistModal.js'
import MaterialsType from './MaterialsType.js'
import LabourType from './LabourType.js'
import GeneralType from './GeneralType.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';

export class ExploreBuildingScreen extends Component { 
  static contextType = ContextInfo
    constructor(props) {
        super(props);
        this.state = {
          spaces: [],
          spacesFetched: false,
          assets: [],
          filteredAssets: [],
          checklists: [],
          filteredChecklist: [],
          dataLoaded: false,
          spaceSelected: false,
          spaceName: '',
          checklistSelected: false,
          checklistTitle: '',
          assetSelected: false,
          assetTitle: '',
          setQuestions: [], // set of questions based on the selected checklist.
        };
        this.spacesFilter = this.spacesFilter.bind(this)
        this.assetsFilter = this.assetsFilter.bind(this)
        this.loadQuestions = this.loadQuestions.bind(this)
        this.updateQuestion = this.updateQuestion.bind(this)
      }

    spacesFilter = (space) => {
      this.state.filteredAssets = this.state.assets.filter(item => item.spaces === space.spaceFloor)
      this.setState({
        selectedSpaceId: space.id,
        spaceSelected: true
      })
    }
    assetsFilter = (asset) => {
      this.state.filteredChecklist = this.state.checklists.filter(item => item.assetCategory === asset.assetCategory || item.assetCategory === "")
      this.setState({
        checklistSelected: false,
        selectedAssetId: asset.id,
        assetSelected: true,
        setQuestions: []
      })
    }

    loadQuestions = (questions, questionTitle) => {
      this.setState({
        setQuestions: Array.from(questions),
        checklistSelected: true
      })
    }

    updateQuestion = (index, value, type, measurement_label = '', measurement_unit = '') => {
      // updates the question text input based on the type passed into the argument.
      let question = this.state.setQuestions.slice(index, index + 1); // shallow copy the question from setQuestions
      if (type == "measurement"){
        console.log("measurement")
        question[0][measurement_label] = value
        question[0][measurement_unit] = measurement_unit
      }
      if (type == "TaskDetails"){
        console.log("TaskDetails")
        question[0][type] = value
      }
      if (type == "UnitCost"){
        console.log("UnitCost")
        question[0][type] = value
      }
      if (type == "InspectionResults"){
        console.log("InspectionResults")
        question[0]["InspectionResults"] = value;
      }
      if (type == "TextOnly"){
        console.log("TextOnly")
        question[0]["TextOnlyForm"] = value;
      }
    }

    onChange = (newState, text, type) => {
      if (type == 'checklist'){
        this.setState({ 
          checklistSelected: newState,
          checklistTitle: text
        })
      }

      if (type == 'asset') {
        this.setState({
          assetSelected: newState,
          assetTitle: text,
        })
      }

      if (type == 'space'){
        this.setState({
          spaceSelected: newState,
          spaceName: text
        })
      }
    }

    componentDidMount = () => {

      var currentDate = new Date() // current datetime as object

      var orgData =  this.props.navigation.state.params.orgData // realm object from props
      var buildingData = this.props.navigation.state.params.buildingData //realm object from props
      this.setState({checklists: orgData.checklists}) //sets checklists

      DBcheckBuildingData(this.context.accountContext.account, orgData, buildingData).then(result => {
        if (!result){
          this.updateBuildingData()
        }else {
          if (result[0].lastUpdated !== undefined && result[0].lastUpdated !== null) {

            //get datetime of last updated organizations
            //and add 1 hour to last updated time
            var addHour = result[0].lastUpdated
            addHour.setHours(addHour.getHours() + 1 )

            // Check last updated timestamp is within 1 hour
            if (this.context.networkContext.isConnected){
              if (currentDate < addHour) {
                console.log("ExploreBuildingScreen load from database: " + result[0].name)
                this.setState({
                  buildingLastUpdated: result[0].lastUpdated.toLocaleString(),
                  spaces: result[0].spaces,
                  assets: result[0].assets,
                  checklists: orgData.checklists,
                  dataLoaded: true
                })
              }
      
              // Check network before fetching API
              if (currentDate >= addHour && this.context.networkContext.isConnected) {
                this.updateBuildingData()
              }
            } else{
              console.log("No network, ExploreBuildingScreen load from database: " + result[0].name)
              this.setState({
                buildingLastUpdated: result[0].lastUpdated.toLocaleString(),
                spaces: result[0].spaces,
                assets: result[0].assets,
                checklists: orgData.checklists,
                dataLoaded: true
              })
            }

          }else{
            this.updateBuildingData()
          }
        }

      })
    }


    updateBuildingData = () => {
      var orgData =  this.props.navigation.state.params.orgData
      var buildingData = this.props.navigation.state.params.buildingData //realm object from props
      var currentDate = new Date() // current datetime as object
      get_building_data(orgData, buildingData, this.context.accountContext.account.api_key).then(api_result => {
        console.log("ExploreBulidingScreen update building data: " + api_result.name)
        var building_data = api_result
        updateBuilding(this.context.accountContext.account, orgData.id, building_data, currentDate)
        this.setState({
          buildingLastUpdated: currentDate.toLocaleString(),
          spaces: api_result.spaces,
          assets: api_result.assets,
          checklists: orgData.checklists,
          dataLoaded: true,
      })
      })
    }

    saveToDevice = () => {
      var datetimeString = new Date().toISOString()
      var building = this.props.navigation.state.params.buildingData
      var asset = building.assets.find(asset => asset.id == this.state.selectedAssetId)
      var checklist = this.state.setQuestions[0]
      var checklistTitle = ''
      var orgData =  this.props.navigation.state.params.orgData


      //inspection for a space
      // _filename = isoDateString + "-" + buildingname + "-" + assetProperty.spacename;
      //inspection for an asset
      var _filename =  datetimeString + "-" + building.name.split(' ').join('-') + "-" + asset.name;
      var checklistObject = {
        Id: datetimeString,
        Name: _filename,
        Content: {
          checklist: {
            MyFields: {
              DemoUserName: 'demousername', // if the user comes fropm the button "try it out"
              DemoUserEmail: 'demouseremail', // if the user comes fropm the button "try it out"
              Date: datetimeString,
              StartTime: datetimeString,
              Duration: datetimeString,
              Time: datetimeString,
              FileName: _filename,
              Address: building.address,
              GeneralComments: 'generalComments',
              flagedit: 'fl_edit', // flagedit not implemented
              Assetname: asset.name,
              Category: asset.categoryabbr,
              SpaceId: 'space.id', // if space is selected, space.id
              SpaceName: 'space.floor', //if space is selected, space.name
              Floor: 'space.floor', // if space is selected, space.floor
              SpaceUsage: 'assetProperty.spaceusage', //if space selected, space.usage
              Description: asset.description,
              Make: asset.make,
              Model: asset.model,
              Serial: asset.serial,
              Building: asset.buildingId,
              WorkOrderNumber: '_WorkOrderNumber', // WorOrderNumber not implemented
              ChecklistCategory: '_ChecklistCategory',
              QRcodeURL: 'qrcodeMapping',
              AssetLocations: {
                AssetLocation: 'allspaces',
              },
              NewSpaces: {
                Spaces: [], 
              },
              Questions: {
                Question: [], // an array of question
              },
              ParentTaskId: '', // Because there is no data in your app , leave it empty
              Task: '', // Because there is no data in your app , leave it empty
              ChecklistId: '', //checklist.id
              ChecklistTitle: checklistTitle,
              EmailReport: '', // email report not implemented
              DeviceGeolocation: { // Geolocation not implemented 
                Longitude: '',
                Latitude: '',
                Altitude: '',
                Accuracy: '',
                AltitudeAccuracy: '',
                Heading: '',
                Speed: '',
                Timestamp: '',
              },
            },
          },
        },
        buildingId: building.id,
        orgId: orgData.id,
        AssetId: asset.id,
      };
      this.state.setQuestions.forEach(question => {
        var formatQuestion = {
            QuestionId: question.id,
            QuestionNumber: question.number,
            TaskTitle: question.question,  
            TaskDetails: question.TaskDetails || "",
            QuestionFormat: question.format,
            Photos: 'photos', // an array of photo
            InspectionResult: question.InspectionResults || "",
            MeasurementLabel: question.Measurementlabel || "",
            Measurement: question.measurement || "",
            MeasurementUnit: question.Measurementunit || "",
            Tool: '',
            Supplier:'',
            UnitCost: question.UnitCost || "",
            QuestionType: question.questiontype || "",
            SalesTax: question.salexaxformat || "",
            Markup: '',
            AllowMultiple: question.allowmultiplechoices,
            Choices: '',
            TextOnly: question.TextOnlyForm || ""
          }
          console.log(formatQuestion)
        // checklistObject.Content.checklist.MyFields.Questions.Question.push()
      })
      // console.log(JSON.stringify(checklistObject,null,1))

  }

  render() {
    
    const noFilteredAssets = <AssetsModal assets = {this.state.assets} assetsFilter={this.assetsFilter} onAssetChange={this.onChange} assetSelected={this.state.assetSelected} assetTitle={ this.state.assetTitle}/>
    const yesFilteredAssets = <AssetsModal assets = {this.state.filteredAssets} assetsFilter = {this.assetsFilter} onAssetChange={this.onChange} assetSelected={this.state.assetSelected} assetTitle={ this.state.assetTitle}/>
    
    const noItemSelected = styles.TextContainer
    const yesItemSelected = styles.TextContainerSelected
    
    const yesFilteredChecklist = <ChecklistModal checklists = {this.state.filteredChecklist} loadQuestions = {this.loadQuestions} checklistSelected = {this.state.checklistSelected} onChecklistChange = {this.onChange} checklistTitle = {this.state.checklistTitle} ></ChecklistModal>
    const noFilteredChecklist = <ChecklistModal checklists = {this.state.checklists} loadQuestions = {this.loadQuestions} checklistSelected = {this.state.checklistSelected} onChecklistChange = {this.onChange} checklistTitle = {this.state.checklistTitle}></ChecklistModal>

    if (!this.state.dataLoaded) {
      return (
        <Text>Loading</Text>
      )
    } else if (this.state.dataLoaded){
      const materialQ = this.state.setQuestions.filter(function(question)  {
        return question.questiontype === "Materials"
      })
    return (
      
      <ScrollView>
        <Text>Connection status: {this.context.networkContext.isConnected ? 'online' : 'offline'}</Text>
        <Text>Logged in as: {this.context.accountContext.account.email}</Text>
        <Text>Building last updated on: {this.state.buildingLastUpdated}</Text>
        <Icon onPress={() => this.updateBuildingData()} style={styles.listIcon} name="refresh" size={20} color="white" />

    <View>
      {/* <View style={this.state.spaceSelected ? yesItemSelected : noItemSelected}> */}
            <SpacesModal spaces = {this.state.spaces} spacesFilter = {this.spacesFilter} onChangeSpace={this.onChange} spaceSelected={this.state.spaceSelected} spaceName={this.state.spaceName} />
      {/* </View> */}
      {/* <View style={this.state.assetSelected ? yesItemSelected : noItemSelected}> */}
        {this.state.spaceSelected ? yesFilteredAssets : noFilteredAssets}
      {/* </View> */}
      {/* <View style={this.state.checklistSelected ? yesItemSelected : noItemSelected}> */}
        {this.state.assetSelected ? yesFilteredChecklist : noFilteredChecklist}  
      {/* </View> */}
      <View>
      {this.state.checklistSelected ?  
      <View>
          <Text style={styles.questionsHeader}>Questions</Text>
      </View> : null }
      {this.state.checklistSelected ?
      <View>
        <FlatList style={styles.flatList}
          data={this.state.setQuestions}
          renderItem={({item, index}) => {
  
            if (item.questiontype === '') {
              return <GeneralType question={{
                item,
                index, 
                updateInspection: this.updateInspectionResults,
                updateQuestion: this.updateQuestion
              }}/>
            }
      
            if (item.questiontype === 'Labour') {
              return <LabourType question={{
                item,
                index, 
                updateInspection: this.updateInspectionResults,
                updateQuestion: this.updateQuestion
              }}/>
            }
      
            if (item.questiontype === 'Materials') {
            return <MaterialsType question={{item, 
              index, 
              updateInspection: this.updateInspectionResults,
              updateQuestion: this.updateQuestion
            }}/>
            }
          }
          }
          keyExtractor={item => this.state.setQuestions.indexOf(item)}
          />
         <View style={{flex:2, flexDirection: 'column', margin: 15 }}>
           <View style={{flex: 1}}>
             <View style={{flex: 3, flexDirection: 'row'}}>
               <View style={{flex: 1}}>
                 <Text>Add labour</Text>
               </View>
               <View style={{flex: 1}}>
                <Text>Add materials</Text>
               </View>
               <View style={{flex: 1}}>
                <Text>Add issue</Text>
               </View>
             </View>
           </View>
           <View style={{flex: 1}}>
            <Text>Additional Comments</Text>
            <TextInput 
              style={{borderWidth: 1, borderColor: 'black', backgroundColor: 'lightgrey'}}
              multiline
              numberOfLines={4}
              textAlignVertical={"top"}
              onChangeText={text => this.setState({GeneralComments: text})}
            />
           </View>
         </View>
        <View style={{flex:2, flexDirection: 'row', justifyContent: 'center', margin: 5}}>
        <View style={{flex:1, margin: 5}}> 
        <Button style={{flex:1, margin: 5}}
        type="solid"
        buttonStyle={{backgroundColor: '#47d66d'}}
        title="Save to device"
        titleStyle={{color: 'white'}}
        onPress={()=> this.saveToDevice()}
        />
        </View>  

        <View style={{flex:1, margin: 5}}>
        <Button 
        type="solid"
        title="Submit"
        buttonStyle={{backgroundColor: '#47d66d'}}
        titleStyle={{color: 'white'}}
        onPress={()=> console.log("Not implemented")}
        />
        </View>
        </View>
      </View>
         : null }
        <TouchableOpacity >
                <View style={styles.row}>
                  <Text style={styles.text}>qrcode</Text>
                  <View>
                    <Icon style={styles.listIcon} name="angle-right" size={30} color="white" />
                  </View>
                </View>
              </TouchableOpacity>
      </View>
    
  </View>
  </ScrollView>
    );
    }
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
  TextContainerSelected: {
    padding: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRightColor: 'green',
    borderRightWidth: 50
  },
  headingTextBold: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
    alignSelf: 'flex-start'
  },
  questionsHeader: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    alignSelf: 'flex-start',
    padding: 5
    
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
    // marginTop: 170,
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

export default ExploreBuildingScreen;