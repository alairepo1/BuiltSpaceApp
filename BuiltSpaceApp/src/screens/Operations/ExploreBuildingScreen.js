import React, {Component} from 'react';
import {ContextInfo} from '../../ContextInfoProvider';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
          checklistSelected: false,
          setQuestions: [],
        };
        this.spacesFilter = this.spacesFilter.bind(this)
        this.assetsFilter = this.assetsFilter.bind(this)
        this.loadQuestions = this.loadQuestions.bind(this)
        this.updateInspectionResults = this.updateInspectionResults.bind(this)
        this.updateMeasurement = this.updateMeasurement.bind(this)
      }

    spacesFilter = (space) => {
      this.state.filteredAssets = this.state.assets.filter(item => item.spaces === space.spaceFloor)
      // console.log(this.state.filteredAssets)
      this.setState({
        selectedSpaceId: space.id,
        spaceSelected: true
      })
    }
    assetsFilter = (asset) => {
      // console.log(assetCategory)
      this.state.filteredChecklist = this.state.checklists.filter(item => item.assetCategory === asset.assetCategory || item.assetCategory === "")
            // console.log(this.state.filteredChecklist[0].questions)

      this.setState({
        selectedAssetId: asset.id,
        assetSelected: true
      })
    }

    loadQuestions = (questions) => {
      this.setState({
        setQuestions: Array.from(questions),
        checklistSelected: true
      })
    }

    updateInspectionResults = (index, result) => {
      // updates the question with the selected button in a question.
      // let setQuestions = [... this.state.setQuestions]
      let question = this.state.setQuestions.slice(index); // copy's the question 
      question[0]["InspectionResults"] = result;
      // setQuestions[index] = question
      // this.setState({setQuestions})
      console.log(this.state.setQuestions[index])
    }

    updateMeasurement = (index, value, type, measurement_val = null) => {
      // updates the question text input based on the type passed into the argument.
      let question = this.state.setQuestions.slice(index); // copy's the question 

      if (type == "measurement"){
        question[0][measurement_val] = value
      }
      if (type == "TaskDetails"){
        question[0][type] = value
      }
      if (type == "UnitCost"){
        question[0][type] = value
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

      if (checklist.name == null){
        checklistTitle = 'General Inspection'
      }
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
              flagedit: 'fl_edit',
              Assetname: asset.name,
              Category: asset.categoryabbr,
              SpaceId: 'space.id', // if space is selected, space.id
              SpaceName: 'space.floor', //if space is selected, space.name
              Floor: 'space.floor', // if space is selected, space.floor
              SpaceUsage: 'assetProperty.spaceusage', //if space selected, space.usage
              Description: asset.escription,
              Make: asset.make,
              Model: asset.model,
              Serial: asset.serial,
              Building: asset.buildingId,
              WorkOrderNumber: '_WorkOrderNumber',
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
              ChecklistId: checklist.id,
              ChecklistTitle: checklistTitle,
              EmailReport: '', // email report no implemented
              DeviceGeolocation: {
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
  }

  render() {
    
    const noFilteredAssets = <AssetsModal assets = {this.state.assets} assetsFilter = {this.assetsFilter}/>
    const yesFilteredAssets = <AssetsModal assets = {this.state.filteredAssets} assetsFilter = {this.assetsFilter}/>
    
    const noItemSelected = styles.TextContainer
    const yesItemSelected = styles.TextContainerSelected
    
    const yesFilteredChecklist = <ChecklistModal checklists = {this.state.filteredChecklist} loadQuestions = {this.loadQuestions}  ></ChecklistModal>
    const noFilteredChecklist = <ChecklistModal checklists = {this.state.checklists} loadQuestions = {this.loadQuestions} ></ChecklistModal>

    if (!this.state.dataLoaded) {
      return(
        <Text>Loading</Text>
      )
    } else if (this.state.dataLoaded){
    return (
      
      <ScrollView>
        <Text>Connection status: {this.context.networkContext.isConnected ? 'online' : 'offline'}</Text>
        <Text>Logged in as: {this.context.accountContext.account.email}</Text>
        <Text>Building last updated on: {this.state.buildingLastUpdated}</Text>
        <Icon onPress={() => this.updateBuildingData()} style={styles.listIcon} name="refresh" size={20} color="white" />

    <View>
      <View style={this.state.spaceSelected ? yesItemSelected : noItemSelected}>
            <SpacesModal spaces = {this.state.spaces} spacesFilter = {this.spacesFilter}/>
      </View>
      <View style={this.state.assetSelected ? yesItemSelected : noItemSelected}>
        {this.state.spaceSelected ? yesFilteredAssets : noFilteredAssets}
      </View>
      <View style={this.state.checklistSelected ? yesItemSelected : noItemSelected}>
        {this.state.assetSelected ? yesFilteredChecklist : noFilteredChecklist}  
      </View>
      <View>
      {this.state.checklistSelected ?  
      <View>
          <Text style={styles.questionsHeader}>Questions</Text>
      </View> : null }
      <FlatList style={styles.flatList}
        data={this.state.setQuestions}
        renderItem={({item, index}) => {

          if (item.questiontype === '') {
            return <GeneralType question={{item}}/>
          }
    
          if (item.questiontype === 'Labour') {
            return <LabourType question={{item}}/>
          }
    
          if (item.questiontype === 'Materials') {
          return <MaterialsType question={{item, 
            index, 
            updateInspection: this.updateInspectionResults,
            updateMeasurement: this.updateMeasurement
          }}/>
          }
        }
        }
        keyExtractor={item => this.state.setQuestions.indexOf(item)}
        />

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
    <TouchableOpacity >
      <View style={styles.row}>
          <Text style={styles.text}>Qr Code</Text>
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