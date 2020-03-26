import React, {Component} from 'react';
import {ContextInfo} from '../../ContextInfoProvider';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, 
  Alert, TextInput, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import {get_building_data} from '../../storage/fetchAPI.js'
import SpacesModal from './SpacesModal.js';
import AssetsModal from './AssetsModal.js'
import {updateBuilding, DBcheckBuildingData, saveInspection, getInspections} from '../../storage/schema/dbSchema'
import ChecklistModal from './ChecklistModal.js'
import MaterialsType from './MaterialsType.js'
import LabourType from './LabourType.js'
import GeneralType from './GeneralType.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import {getStartTime, calculateDurationInspection} from '../../functions/functions.js'
import { CameraKitCameraScreen } from 'react-native-camera-kit'
import { CameraKitGalleryView } from 'react-native-camera-kit'
import FlatlistFooter from './components/ExploreBuildingFlatlistFooter'
export class ExploreBuildingScreen extends Component { 
  static contextType = ContextInfo
    constructor(props) {
        super(props);
        this.state = {
          isPermitted: false,
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
          qrCodeValue: '',
          startScanner: false,
          setQuestions: [], // set of questions based on the selected checklist.
          checklistId: ''
        };
        this.spacesFilter = this.spacesFilter.bind(this)
        this.assetsFilter = this.assetsFilter.bind(this)
        this.loadQuestions = this.loadQuestions.bind(this)
        this.updateQuestion = this.updateQuestion.bind(this)
        this.cameraOnPress = this.cameraOnPress.bind(this)
        this.onBottomButtonPressed = this.onBottomButtonPressed.bind(this)
      }

    spacesFilter = (space) => {
      this.state.filteredAssets = this.state.assets.filter(item => item.spaces === space.floor)
      this.setState({
        selectedSpaceId: space.id,
        spaceSelected: true
      })
    }
    assetsFilter = (asset) => {
      this.state.filteredChecklist = this.state.checklists.filter(item => item.assetCategory === asset.categoryabbr || item.assetCategory === "")
      this.setState({
        selectedAssetId: asset.id,
      })
    }

    loadQuestions = (questions, questionTitle, checklistId) => {
      this.setState({
        setQuestions: Array.from(questions),
        checklistSelected: true,
        checklistId
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

    onChange = (newState, text = '', type) => {
      if (type == 'checklist'){
        let StartTime = getStartTime()
        this.setState({ 
          checklistSelected: newState,
          checklistTitle: text,
          StartTime: StartTime
        })
      }

      if (type == 'asset') {
        this.setState({
          assetSelected: newState,
          assetTitle: text,
          checklistSelected: false,
          StartTime: '',
          setQuestions: []
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
      this.loadData()
    }

    loadData = () => {
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


    saveAlert = () => {
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
    
    openLink = () => {
 
      Linking.openURL(this.state.qrCodeValue);
   
    }
   
    onQRCodeScanDone = (qrCode) => {
   
      this.setState({ qrCodeValue: qrCode });
   
      this.setState({ startScanner: false });
    }
   
    openQRCodeScanner = () => {
   
      var that = this;
   
      if (Platform.OS === 'android') {
        async function requestCameraPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA, {
                'title': 'BuiltSpace App Permission',
                'message': 'Builtspace needs access to your camera '
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
   
              that.setState({ qrCodeValue: '' });
              that.setState({ startScanner: true });
            } else {
              alert("CAMERA permission denied");
            }
          } catch (err) {
            alert("Camera permission err", err);
            console.warn(err);
          }
        }
        requestCameraPermission();
      } else {
        that.setState({ qrCodeValue: '' });
        that.setState({ startScanner: true });
      }
    }

    saveToDevice = () => {
      const date = new Date()
      const dateString = date.toISOString().split('T')[0];
      const time = date.getTime()
      const building = this.props.navigation.state.params.buildingData
      const asset = this.state.assets.find(asset => asset.id == this.state.selectedAssetId)
      const orgData =  this.props.navigation.state.params.orgData
      const duration = calculateDurationInspection()

      //inspection for a space
      // _filename = isoDateString + "-" + buildingname + "-" + assetProperty.spacename;
      //inspection for an asset
      const _filename =  dateString + "-" + building.name.split(' ').join('-') + "-" + asset.name;
      try{
        var checklist = {
          MyFields: {
            DemoUserName: 'demousername', // if the user comes fropm the button "try it out"
            DemoUserEmail: 'demouseremail', // if the user comes fropm the button "try it out"
            Date: dateString,
            StartTime: this.state.StartTime,
            Duration: duration, //convert to string?
            Time: time,
            FileName: _filename,
            Address: building.address,
            GeneralComments: this.state.GeneralComments || "",
            flagedit: 'fl_edit', // flagedit not implemented
            Assetname: asset.name,
            Category: asset.categoryabbr,
            SpaceId:  null, // if space is selected, space.id
            SpaceName:  "", //if space is selected, space.suitenumber
            Floor: "", // if space is selected, space.floor
            SpaceUsage: "", //if space selected, space.usage
            Description: asset.description,
            Make: asset.make,
            Model: asset.model,
            Serial: asset.serial,
            Building: asset.buildingId,
            WorkOrderNumber: 'WorkOrderNumber', // WorOrderNumber not implemented
            ChecklistCategory: 'ChecklistCategory',
            QRcodeURL: 'qrcodeMapping',
            AssetLocations: {
              AssetLocation: 'allspaces',
            },
            NewSpaces: {
              Spaces: [], 
            },
            Questions: {
              Question: [], // an array of questions
            },
            ParentTaskId: '', // Because there is no data in your app , leave it empty
            Task: '', // Because there is no data in your app , leave it empty
            ChecklistId: this.state.checklistId, //checklist.id
            ChecklistTitle: this.state.checklistTitle,
            EmailReport: '', // email report not implemented
            DeviceGeolocation: { // Geolocation not implemented 
              Longitude: '',
              Latitude: '',
              Altitude: '',
              Accuracy: '',
              AltitudeAccuracy: '',
              Heading: '',
              Speed: '',
              Timestamp: dateString,
            },
          }
        }
  
        if (this.state.spaceSelected){
          const spaces = Array.from(this.state.spaces)
          const space = spaces.filter(space => space.id == this.state.selectedSpaceId)
          checklist.MyFields.SpaceId = space[0].id
          checklist.MyFields.SpaceName = space[0].suitenumber //if space is selected, space.name
          checklist.MyFields.Floor = space[0].floor // if space is selected, space.floor
          checklist.MyFields.SpaceUsage = space[0].usage  //if space selected, space.usage
          
        }
  

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
            checklist.MyFields.Questions.Question.push(formatQuestion)
        })
        
        var checklistObject = {
          Id: dateString,
          Name: _filename,
          Content: checklist,
          buildingId: building.id,
          orgId: orgData.id,
          AssetId: asset.id,
        };
        saveInspection(this.context.accountContext.account, checklistObject)
      }catch(e){console.log(e)}
      console.log("save to device")
  }
    cameraOnPress = () => {
      var that = this;
      if (Platform.OS === 'android') {
        async function requestCameraPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: 'CameraExample App Camera Permission',
                message: 'CameraExample App needs access to your camera ',
              }
            ); 
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              //If CAMERA Permission is granted
              //Calling the WRITE_EXTERNAL_STORAGE permission function
              requestExternalWritePermission();
            } else {
              alert('CAMERA permission denied');
            }
          } catch (err) {
            alert('Camera permission err', err);
            console.warn(err);
          }
        }
        async function requestExternalWritePermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'CameraExample App External Storage Write Permission',
                message:
                  'CameraExample App needs access to Storage data in your SD Card ',
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              //If WRITE_EXTERNAL_STORAGE Permission is granted
              //Calling the READ_EXTERNAL_STORAGE permission function
              requestExternalReadPermission();
            } else {
              alert('WRITE_EXTERNAL_STORAGE permission denied');
            }
          } catch (err) {
            alert('Write permission err', err);
            console.warn(err);
          }
        }
        async function requestExternalReadPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'CameraExample App Read Storage Read Permission',
                message: 'CameraExample App needs access to your SD Card ',
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              //If READ_EXTERNAL_STORAGE Permission is granted
              //changing the state to re-render and open the camera
              //in place of activity indicator
              that.setState({ isPermitted: true });
            } else {
              alert('READ_EXTERNAL_STORAGE permission denied');
            }
          } catch (err) {
            alert('Read permission err', err);
            console.warn(err);
          }
        }
        //Calling the camera permission function
        requestCameraPermission();
      } else {
        this.setState({ isPermitted: true });
      }
    }
    onBottomButtonPressed(event) {
      const captureImages = JSON.stringify(event.captureImages);
      if (event.type === 'left') {
        this.setState({ isPermitted: false });
      } else {
        
        console.log(
  "Image URI: (event.captureImages is an array of the picture taken, and if you click the bottom camera button really fast it takes a whole bunch for some reason",event.captureImages[0].uri)
        Alert.alert(
          event.type,
          captureImages,
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
      }
    }
    addQuestion = (type) => {
      var questions = this.state.setQuestions
      var checklistTitle = this.state.checklistTitle
      var checklistId = this.state.checklistId
      if (type == "labour"){
        let labourQuestion = {
          "allowmultiplechoices": false,
          "checklistid": checklistId,
          "checklisttitle": checklistTitle,
          "colorformat": "#98d9ea|#00a2e8|#3366cc|#232b85",
          "displayproperty": false,
          "format": "Regular|Overtime|Double Time|Other",
          "id": 0,
          "markupformat": "",
          "measurementlabel": "Labour",
          "measurementonly": false,
          "measurementunit": "Hours",
          "number": "",
          "propertygroup": "",
          "propertyname": "",
          "question": "Enter hours",
          "questiontype": "Labour",
          "remarks": "",
          "salestaxformat": "",
          "showmeasurement": true,
          "textonly": false,
          "updateproperty": false,
          "updatepropertyfromcurrent": false,
          "validationpattern": ""
      }
        questions.push(labourQuestion)
      }
    if (type == "materials"){

      let materialQuestion = {
          "allowmultiplechoices": false,
          "checklistid": checklistId,
          "checklisttitle": checklistTitle,
          "colorformat": "#98d9ea|#00a2e8|#3366cc|#232b85|#151a51",
          "displayproperty": false,
          "format": "PO|Tools|Truck Stock|3rd Party|Other",
          "id": 0,
          "markupformat": "||||",
          "measurementlabel": "Quantity",
          "measurementonly": false,
          "measurementunit": "",
          "number": "",
          "propertygroup": "",
          "propertyname": "",
          "question": "Enter Materials",
          "questiontype": "Materials",
          "remarks": "",
          "salestaxformat": "||||",
          "showmeasurement": true,
          "textonly": false,
          "updateproperty": false,
          "updatepropertyfromcurrent": false,
          "validationpattern": ""
      }
      questions.push(materialQuestion)
    }
    if (type == "issue"){
      let issueQuestion = {
        "allowmultiplechoices": false,
        "checklistid": checklistId,
        "checklisttitle": "Issue found",
        "colorformat": "#00cc66|#00a2e8|#ff0000|#FFD700",
        "displayproperty": false,
        "format": "Good|Reparied|Quote|Monitor",
        "id": '',
        "markupformat": "",
        "measurementlabel": "Labour",
        "measurementonly": false,
        "measurementunit": "Hours",
        "number": "",
        "propertygroup": "",
        "propertyname": "",
        "question": "Enter hours",
        "questiontype": "Labour",
        "remarks": "",
        "salestaxformat": "",
        "showmeasurement": true,
        "textonly": false,
        "updateproperty": false,
        "updatepropertyfromcurrent": false,
        "validationpattern": ""
      }
      questions.push(issueQuestion)
    }
    this.setState({setQuestions: questions})
    }

    renderFlatlistFooter = () => {
      return <FlatlistFooter addQuestion={this.addQuestion} />
    }
  render() {
    
    const noFilteredAssets = <AssetsModal assets = {this.state.assets} assetsFilter={this.assetsFilter} onAssetChange={this.onChange} assetSelected={this.state.assetSelected} assetTitle={ this.state.assetTitle}/>
    const yesFilteredAssets = <AssetsModal assets = {this.state.filteredAssets} assetsFilter = {this.assetsFilter} onAssetChange={this.onChange} assetSelected={this.state.assetSelected} assetTitle={ this.state.assetTitle}/>
    
    const noItemSelected = styles.TextContainer
    const yesItemSelected = styles.TextContainerSelected
    
    const yesFilteredChecklist = <ChecklistModal checklists = {this.state.filteredChecklist} loadQuestions = {this.loadQuestions} checklistSelected = {this.state.checklistSelected} onChecklistChange = {this.onChange} checklistTitle = {this.state.checklistTitle} ></ChecklistModal>
    const noFilteredChecklist = <ChecklistModal checklists = {this.state.checklists} loadQuestions = {this.loadQuestions} checklistSelected = {this.state.checklistSelected} onChecklistChange = {this.onChange} checklistTitle = {this.state.checklistTitle}></ChecklistModal>

    if (!this.state.dataLoaded ) {
      return (
        <Text>Loading</Text>
      )
    } else if (this.state.dataLoaded && !this.state.startScanner){
      const materialQ = this.state.setQuestions.filter(function(question)  {
        return question.questiontype === "Materials"
      })
  
      if (this.state.isPermitted) {
        return (
          <CameraKitCameraScreen
            // Buttons to perform action done and cancel
            actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
            onBottomButtonPressed={event => this.onBottomButtonPressed(event)}
            flashImages={{
              // Flash button images
              on: require('../assets/flashon.png'),
              off: require('../assets/flashoff.png'),
              auto: require('../assets/flashauto.png'),
            }}
            cameraFlipImage={require('../assets/flip.png')}
            captureButtonImage={require('../assets/capture.png')}
          />
        );
      }
      else {
      
    return (
      
      <ScrollView>
        <Text>Connection status: {this.context.networkContext.isConnected ? 'online' : 'offline'}</Text>
        <Text>Logged in as: {this.context.accountContext.account.email}</Text>
        <Text>Building last updated on: {this.state.buildingLastUpdated}</Text>
        <Icon onPress={() => this.updateBuildingData()} style={styles.listIcon} name="refresh" size={20} color="black" />

    <View>
        <SpacesModal spaces = {this.state.spaces} spacesFilter = {this.spacesFilter} onSpaceChange={this.onChange} spaceSelected={this.state.spaceSelected} spaceName={this.state.spaceName} />
        {this.state.spaceSelected ? yesFilteredAssets : noFilteredAssets}
        {this.state.assetSelected ? yesFilteredChecklist : noFilteredChecklist}  
      <View>
      {this.state.checklistSelected ?  
      <View>
          <Text style={styles.questionsHeader}>Questions</Text>
      </View> : null }
      {this.state.checklistSelected ?
      <View>
        <FlatList style={styles.flatList}
          data={this.state.setQuestions}
          extraData={this.state.setQuestions}
          ListFooterComponent={this.renderFlatlistFooter}
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
        onPress={() =>  { this.saveAlert() }
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

        <View>
          <Button
          title="Upload picture"
          onPress={this.cameraOnPress}
          ></Button>
        </View>
        <View>
          
        </View>
        </View>
      </View>
         : null }
        <TouchableOpacity onPress={this.openQRCodeScanner}>
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
    return (
      <View style={{ flex: 1 }}>
 
        <CameraKitCameraScreen
          showFrame={true}
          scanBarcode={true}
          laserColor={'#FF3D00'}
          frameColor={'#00C853'}
          colorForScannerFrame={'black'}
          onReadCode={event =>
            this.onQRCodeScanDone(event.nativeEvent.codeStringValue)
          }
        />
 
      </View>
    );

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
    backgroundColor: '#FAF9ED',
  }


})

export default ExploreBuildingScreen;