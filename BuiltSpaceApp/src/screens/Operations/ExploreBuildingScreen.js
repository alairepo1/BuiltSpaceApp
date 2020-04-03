import React, {Component} from 'react';
import {ContextInfo} from '../../ContextInfoProvider';
import {View, Text, FlatList, TouchableOpacity, ScrollView, 
  Alert, TextInput, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import {get_building_data} from '../../storage/fetchAPI.js'
import SpacesModal from './components/SpacesModal.js';
import AssetsModal from './components/AssetsModal.js'
import {updateBuilding, DBcheckBuildingData, saveInspection, getInspections} from '../../storage/schema/dbSchema'
import ChecklistModal from './components/ChecklistModal.js'
import MaterialsType from './components/MaterialsType.js'
import LabourType from './components/LabourType.js'
import GeneralType from './components/GeneralType.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import {getStartTime, formatInspectionObject, formatAddQuestion} from '../../functions/functions.js'
import { CameraKitCameraScreen } from 'react-native-camera-kit'
import { CameraKitGalleryView } from 'react-native-camera-kit'
import FlatlistFooter from './components/ExploreBuildingFlatlistFooter'
import styles from './BuildingScreen.style.js';


export class ExploreBuildingScreen extends Component { 
  static contextType = ContextInfo
    constructor(props) {
        super(props);
        this.state = {
          isPermitted: false,
          spaces: [],
          assets: [],
          filteredAssets: [], // if space is selected, use this array to render the asset modal
          checklists: [], 
          filteredChecklist: [], // this array is loaded into the checklist.
          dataLoaded: false,
          spaceSelected: false,
          spaceName: '',
          checklistSelected: false,
          checklistTitle: '',
          assetSelected: false,
          assetTitle: '',
          qrCodeValue: '',
          setQuestions: [], // set of questions based on the selected checklist.
          checklistId: '',
          disableSpace: false,
          disableChecklist: true
        };
        this.spacesFilter = this.spacesFilter.bind(this)
        this.assetsFilter = this.assetsFilter.bind(this)
        this.loadQuestions = this.loadQuestions.bind(this)
        this.updateQuestion = this.updateQuestion.bind(this)
xxxxxxxxxxx        this.cameraOnPress = this.cameraOnPress.bind(this)
        this.onBottomButtonPressed = this.onBottomButtonPressed.bind(this)
        this.loadQRCode = this.loadQRCode.bind(this)
      }

    spacesFilter = (space) => {
      /*
        in spacesModal, this function will be called to update the state in this screen.
        When a space is selected, this function will run and
        sets the filters the assets state variable by comparing space.floor and asset.spaces properties
      */
      var filteredAssets = this.state.assets.filter(item => item.spaces === space.floor)
      var filteredChecklist = []
      for (var checklist_index=0; checklist_index < this.state.checklists.length ; checklist_index ++){
        if (this.state.checklists[checklist_index].assetCategory == ""){filteredChecklist.push(this.state.checklists[checklist_index])}
        for (var asset_index=0; asset_index < filteredAssets.length; asset_index++){
          if (filteredAssets[asset_index].categoryabbr == this.state.checklists[checklist_index].assetCategory){
            filteredChecklist.push(this.state.checklists[checklist_index])
          }
        }
      }
      this.setState({
        selectedSpaceId: space.id,
        spaceSelected: true,
        filteredAssets,
        filteredChecklist,
      })
    }
    assetsFilter = (asset) => {
      /*
        in assetModal, this function will be called to update the state in this screen.
        When an asset is selected, this function will run and
        checks if a space is already selected to choose which checklist to filter.
        filters the checklist/filteredChecklist state variable by comparing checklist.assetCategory and asset.categoryabbr properties
      */
     if (this.state.spaceSelected){
       var filteredChecklist = this.state.filteredChecklist.filter(item => item.assetCategory === asset.categoryabbr || item.assetCategory === "")
       this.setState({
         selectedAssetId: asset.id,
         filteredChecklist,
         disableSpace: true,
       })
    }else{
      this.state.filteredChecklist = this.state.checklists.filter(item => item.assetCategory === asset.categoryabbr || item.assetCategory === "")
      this.setState({
        selectedAssetId: asset.id,
        disableSpace: true,
      })
     }
    }

    loadQuestions = (questions, checklistId) => {
      /*
        sets the questions for the flatlist to render 
        in this Screen and assigns a state variable
        for the selected checklist id.
       */
      if (this.state.checklistSelected){
        this.setState({
          checklistSelected: false,
          disableChecklist: false,
          StartTime: '',
          setQuestions: [],
          questionsLoading: true
        }, () => {this.setNewQuestions(questions, checklistId)})
      }else {{this.setNewQuestions(questions, checklistId)}}
      
    }

    setNewQuestions = (questions, checklistId) => {
      // 
      var StartTime = getStartTime()
      this.setState({
        setQuestions: Array.from(questions),
        checklistSelected: true,
        checklistTitle: checklistId,
        StarTime: StartTime,
        checklistId,
        questionsLoading: false
      })
    }
    updateQuestion = (index, value, type, measurement_label = '', measurement_unit = '') => {
      /*
        updates the question text input based on the type passed into the argument.
        
        This function will update the question based on the index loaded in the flatlist.

        There are checkers for each input text from the question and updates the property
        based on the type.
       */
      let question = this.state.setQuestions.slice(index, index + 1); // shallow copy the question from setQuestions
      if (type == "measurement"){
        question[0]["measurement_label"] = value
        question[0]["measurement_unit"] = measurement_unit
      }
      if (type == "TaskDetails"){
        question[0][type] = value
      }
      if (type == "UnitCost"){
        question[0]["type"] = value
      }
      if (type == "InspectionResults"){
        question[0]["InspectionResults"] = value;
      }
      if (type == "TextOnly"){
        question[0]["TextOnlyForm"] = value;
      }
    }
    resetState = () => {
      /*
        when refresh is pressed, this function will reset all assigned states.
       */
      this.setState({
        spaces: [],
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
        qrCodeValue: '',
        setQuestions: [], // set of questions based on the selected checklist.
        checklistId: '',
        disableSpace: false,
      })
    }
    onChange = (newState, text = null, type) => {
      /*
        when a space, asset or checklist type is selected, this function
        will assign a states based on the type.
        The modal components will change based on the states 
       */
      if (type == 'asset') {
        if (newState == false){ 
          this.setState({disableSpace: false})
        }else {
          this.setState({
            assetSelected: newState,
            assetTitle: text,
            checklistSelected: false,
            disableChecklist: false,
            StartTime: '',
            setQuestions: []
          })
        }
      }

      if (type == 'space'){
        if (newState == false){ 
          this.setState({
            spaceSelected: newState,
            StartTime: '',
            disableChecklist: true,
            checklistSelected: false,
            assetSelected: newState,
        })}else{
          this.setState({
            spaceSelected: newState,
            spaceName: text,
            StartTime: '',
            disableChecklist: false,
            assetSelected: false,
            checklistSelected: false,
          })
        }
      }
    }

    componentDidMount = () => {
      this.loadData()
    }

    loadData = () => {
      /*
        on component did mount, this function will check if their
        is building data in realm db.
        if none, it will run the updateBuildingData function
        if it exists, the function will check the datetime if 1 hour has passed.
        if the time exeeds 1 hour from the last update, it will run
        the updateBulidingData function.
      */
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
          }
        }

      })
    }

    updateBuildingData = () => {
      /*
        The function will call get_building_data from fetchAPI.js
        and returns the building details as an array of objects
       */
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


    saveAlert = () => {
      /**On button press to save inspection to device,
        will trigger this alert
       */
      Alert.alert(
        'Confirmation',
        'Are all the questions answered? ' +
        'You will not be able to edit this inspection '+ 
        'after saving. Press OK to save to your device.',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => this.saveToDevice() },
        ],
        { cancelable: true }
      )
    }

    saveToDevice = () => {
      /*
      Confirmation from saveAlert will trigger this function to format the checklistObject
      and saves the object into realm db
       */

      if (this.state.spaceSelected){
        var spaceSelected = this.state.spaceSelected
        var spaceSelectedId = this.state.selectedSpaceId
        var spaces = Array.from(this.state.spaces)
      }

      try{
        //runs the function formatInspectionObject from functions.js
        const checklistObject = formatInspectionObject(
          this.props.navigation.state.params.buildingData, 
          this.state.assets.find(asset => asset.id == this.state.selectedAssetId), 
          this.props.navigation.state.params.orgData, 
          this.state.StartTime, 
          this.state.GeneralComments,
          this.state.checklistId,
          this.state.checklistTitle, 
          this.state.setQuestions, 
          spaceSelected, 
          spaceSelectedId, 
          spaces)
        saveInspection(this.context.accountContext.account, checklistObject)
      }catch(e){console.log(e)}
  }
    
    addQuestion = (type) => {
      var questions = this.state.setQuestions
      var checklistTitle = this.state.checklistTitle
      var checklistId = this.state.checklistId

      try {
        const addedQuestions = formatAddQuestion(type,questions,checklistTitle,checklistId)
        this.setState({setQuestions: addedQuestions})
      }catch(e){console.log("addQuestion error: ", e)}

    }

    renderFlatlistFooter = () => {
      return <FlatlistFooter addQuestion={this.addQuestion} />
    }

    alertNotSelected = () => {
      Alert.alert(
        'Error',
        'Asset is not selected',
        [
          {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
        ],
        { cancelable: true }
      )
    }

    loadQRCode = (type, type_name, typeid, filteredAssets = null, filteredChecklist) => {
      if (type == 'space'){
        this.setState({
          selectedSpaceId: typeid,
          spaceSelected: true,
          disableSpace: true,
          disableChecklist: false,
          assetSelected: false,
          checklistSelected: false,
          StartTime: '',
          filteredAssets,
          filteredChecklist
        })
      }

      if (type == 'asset'){
        this.onChange(true,type_name,'asset')
        this.setState({
          assetSelected: true,
          assetTitle: type_name,
          spaceSelected: false,
          disableSpace: true,
          checklistSelected: false,
          disableChecklist: false,
          StartTime: '',
          selectedAssetId: typeid,
          setQuestions: [],
          filteredChecklist
        })
      }
    }

  render() {
    const noFilteredAssets = <AssetsModal assets = {this.state.assets} assetsFilter={this.assetsFilter} onAssetChange={this.onChange} 
                                          assetSelected={this.state.assetSelected} assetTitle={ this.state.assetTitle}/>

    const yesFilteredAssets = <AssetsModal assets = {this.state.filteredAssets} assetsFilter = {this.assetsFilter} onAssetChange={this.onChange} 
                                           assetSelected={this.state.assetSelected} assetTitle={ this.state.assetTitle}/>
    
    const yesFilteredChecklist = <ChecklistModal checklists = {this.state.filteredChecklist} loadQuestions = {this.loadQuestions} 
                                                 checklistSelected = {this.state.checklistSelected} onChecklistChange = {this.onChange} 
                                                 checklistTitle = {this.state.checklistTitle} disableChecklist={this.state.disableChecklist}></ChecklistModal>

    const noFilteredChecklist = <ChecklistModal checklists = {this.state.checklists} loadQuestions = {this.loadQuestions} 
                                                checklistSelected = {this.state.checklistSelected} onChecklistChange = {this.onChange} 
                                                checklistTitle = {this.state.checklistTitle} disableChecklist={this.state.disableChecklist}></ChecklistModal>

    if (!this.state.dataLoaded ) {
      return (
      <View>
        <ActivityIndicator />
        <Text>Loading...</Text>
      </View>
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
        <View style={{flexDirection: 'row'}}>
        <Icon onPress={() => {
          this.setState({dataLoaded: false})
          this.resetState()
          this.updateBuildingData() 
        }} 
        style={styles.listIcon} name="refresh" size={20} color="black" />
        <Text>  Reload Data</Text>
        </View>

    <View>
        <SpacesModal disableSpace={this.state.disableSpace} spaces = {this.state.spaces} spacesFilter = {this.spacesFilter} onSpaceChange={this.onChange} 
                     spaceSelected={this.state.spaceSelected} spaceName={this.state.spaceName} />

        {this.state.spaceSelected ? yesFilteredAssets : noFilteredAssets}
        {this.state.spaceSelected ? yesFilteredChecklist : (this.state.assetSelected ? yesFilteredChecklist : noFilteredChecklist)}

      <View>
        {this.state.questionsLoading ? null :
              this.state.checklistSelected ?
                <View>
                  <Text style={styles.questionsHeader}>Questions</Text>
          
                  <FlatList style={styles.flatList}
                    data={this.state.setQuestions}
                    extraData={this.state.setQuestions}
                    ListFooterComponent={this.renderFlatlistFooter}
                    renderItem={({item, index}) => {
            
                      if (item.questiontype === '') {
                        return <GeneralType question={{
                          item,
                          index, 
                          updateQuestion: this.updateQuestion
                        }}/>
                      }
                
                      if (item.questiontype === 'Labour') {
                        return <LabourType question={{
                          item,
                          index, 
                          updateQuestion: this.updateQuestion
                        }}/>
                      }
                
                      if (item.questiontype === 'Materials') {
                      return <MaterialsType question={{item, 
                        index, 
                        updateQuestion: this.updateQuestion
                      }}/>
                      }
                    }
                    }
                    keyExtractor={item => this.state.setQuestions.indexOf(item)}
                    />
                   <View style={{flex:2, flexDirection: 'column', margin: 15 }}>
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
                  <View style={{flex:3, flexDirection: 'row', justifyContent: 'center', margin: 5}}>
                  <View style={{flex:1, margin: 5}}> 
                  <Button style={{flex:1, margin: 5}}
                  type="solid"
                  buttonStyle={{backgroundColor: '#47d66d'}}
                  title="Save to device"
                  titleStyle={{color: 'white'}}
                  onPress={() =>  { 
                    if (this.state.assetSelected) {
                      this.saveAlert() 
                  } else {
                    this.alertNotSelected()
                  }}
                  }
                  />
                  </View>  
          
                  <View style={{flex:1, margin: 5}}>
                  <Button 
                  type="solid"
                  title="Submit"
                  buttonStyle={{backgroundColor: '#47d66d'}}
                  titleStyle={{color: 'white'}}
                  onPress={()=> {getInspections(this.context.accountContext.account).then(result => {console.log(JSON.stringify(result,null,1))})}}
                  />
                  </View>
          
                  <View style={{flex:1, margin: 5}}>
                    <Button
                    title="Upload picture"
                    onPress={this.cameraOnPress}
                    ></Button>
                  </View>
                  <View>
                    
                  </View>
                  </View>
                  <View style={{flex:1, margin: 5}}>
                    <Button
                    title="Home"
                    onPress={() => this.props.navigation.navigate("Home")}
                    ></Button>
                    </View>
                </View>
                   : null 
        }

        <TouchableOpacity onPress={ () => this.props.navigation.navigate("QRCode", {
          loadQRCode: this.loadQRCode,
          checklists:this.state.checklists,
          spaces:this.state.spaces,
          assets:this.state.assets,
          qrcodes: this.props.navigation.state.params.buildingData.qrcodes,
          })}>
                <View style={styles.row}>
                  <Text style={styles.text}>Scan Qr</Text>
                  <View>
                    <Icon style={styles.listIcon} name="angle-right" size={30} color="black" />
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
}

export default ExploreBuildingScreen;