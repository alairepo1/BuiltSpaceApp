import React, {Component} from 'react';
import { NetworkContext } from '../../networkProvider';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import {get_building_data} from '../../storage/fetchAPI.js'
import SpacesModal from './SpacesModal.js';
import AssetsModal from './AssetsModal.js'
import {updateBuilding, DBcheckBuildingData} from '../../storage/schema/dbSchema'
import ChecklistModal from './ChecklistModal.js'
import MaterialsType from './MaterialsType.js'
import LabourType from './LabourType.js'
import GeneralType from './GeneralType.js'
import Icon from 'react-native-vector-icons/FontAwesome';

export class ExploreBuildingScreen extends Component { 
  static contextType = NetworkContext;
    constructor(props) {
        super(props);
        this.state = {
          account: {
            api_key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
            email: 'bcitbuiltspace@gmail.com',
            id: 400,
          },
          building_data: [],
          key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
          spaces: [],
          spacesFetched: false,
          assets: [],
          filteredAssets: [],
          checklists: [],
          filteredChecklist: [],
          dataLoaded: false,
          spaceSelected: false,
          checklistSelected: false,
          questions:[],
          MaterialsQuestions: [],
          LabourQuestions: [],
          GeneralQuestions: [],
          setQuestions: []
        };
        this.spacesFilter = this.spacesFilter.bind(this)
        this.assetsFilter = this.assetsFilter.bind(this)
        this.loadQuestions = this.loadQuestions.bind(this)
      }

    spacesFilter = (spaceFloor) => {
      this.state.filteredAssets = this.state.assets.filter(item => item.spaces === spaceFloor)
      // console.log(this.state.filteredAssets)
      this.setState({
        spaceSelected: true
      })
    }
    assetsFilter = (assetCategory) => {
      // console.log(assetCategory)
      this.state.filteredChecklist = this.state.checklists.filter(item => item.assetCategory === assetCategory || item.assetCategory === "")
            // console.log(this.state.filteredChecklist[0].questions)

      this.setState({
        assetSelected: true
      })
    }

    loadQuestions = (questions) => {
      console.log("questions",questions.length)
      this.setState({
        setQuestions: Array.from(questions),
        checklistSelected: true
      })
      console.log("setquestions ",this.state.setQuestions.length)
    }

    componentDidMount = () => {
      var orgData =  this.props.navigation.state.params.orgData // realm object
      var buildingData = this.props.navigation.state.params.buildingData //realm object
      this.setState({checklists: orgData.checklists}) //sets checklists

      DBcheckBuildingData(this.state.account, orgData, buildingData).then(result => {
        if (!result){
          get_building_data(orgData, buildingData, this.state.key).then(result => {
            console.log('get_building_data api call: ') 
            var building_data = result
            updateBuilding(this.state.account, orgData.id,building_data)
            this.setState({
              spaces: result.spaces,
              assets: result.assets,
              dataLoaded: true,
            })
          })
        }else {
          if (result[0].lastUpdated !== undefined && result[0].lastUpdated !== null) {

            //get datetime of last updated organizations
            //and add 1 hour to last updated time
            var addHour = result[0].lastUpdated
            addHour.setHours(addHour.getHours() + 1 )
            
            //current datetime
            // var currentDateString = new Date().toISOString().replace('Z', '')
            var currentDate = new Date()

            // Check last updated timestamp is within 1 hour
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
            if (currentDate >= addHour) {
                get_building_data(orgData, buildingData, this.state.key).then(api_result => {
                  console.log("ExploreBulidingScreen refetch data 1 after hour" + result[0].name)
                  var building_data = api_result
                  updateBuilding(this.state.account, orgData.id, building_data)
                  this.setState({
                    spaces: api_result.spaces,
                    assets: api_result.assets,
                    checklists: orgData.checklists,
                    dataLoaded: true,
                 })
                })
            }

          }else{
            get_building_data(orgData, buildingData, this.state.key).then(api_result => {
              console.log('get_building_data api call: ' + result[0].name) 
              var building_data = api_result
              updateBuilding(this.state.account, orgData.id, building_data)
              this.setState({
                spaces: api_result.spaces,
                assets: api_result.assets,
                checklists: orgData.checklists,
                dataLoaded: true,
              })
            })
          }
        }

 
    // checkQuestionType = (questionObj) => {

    //   if (questionObj.questiontype == '') {
    //     return <GeneralType question={questionObj}/>
    //   }

    //   if (questionObj.questiontype == 'Labour') {
    //     return <LabourType question={questionObj}/>
    //   }

    //   if (questionObj.questiontype == 'Materials') {
    //     return <MaterialsType question={questionObj}/>
    //   }
    // }
  
      })
    }

  render() {
    const {navigation} = this.props;
    
    // const buildingId = navigation.getParam('buildingId', 'None')
    // const buildingName = navigation.getParam('buildingName', 'None');
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
        <Text>Connection status: {this.context.isConnected ? 'online' : 'offline'}</Text>
        <Text>Logged in as: {this.state.account.email}</Text>
        <Text>Account last updated on: {this.state.accountlastUpdated}</Text>
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
        renderItem={({item}) => {

          if (item.questiontype === '') {
            return <GeneralType question={{item}}/>
          }
    
          if (item.questiontype === 'Labour') {
            return <LabourType question={{item}}/>
          }
    
          if (item.questiontype === 'Materials') {
          return <MaterialsType question={{item}}/>
          }
        }
        }
        keyExtractor={item => item.id}
        />
      <TouchableOpacity >
      <View style={styles.row}>
          <Text style={styles.text}>Qr Code</Text>
      </View>  
    </TouchableOpacity>
      </View>
    
  <FlatList style={styles.flatList}
      data={[{qrcode: 'Scan Qr'}]}
      renderItem={({item}) => 
      <View>

      </View>
      }
      keyExtractor={item => item.name}
      />
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