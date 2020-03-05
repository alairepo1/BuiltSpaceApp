import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import StatusBar from '../../statusComponent.js';
import {get_building_data} from '../../storage/fetchAPI.js'
import SpacesModal from './SpacesModal.js';
import AssetsModal from './AssetsModal.js'
import ChecklistModal from './ChecklistModal.js'
import MaterialsType from './MaterialsType.js'
import LabourType from './LabourType.js'
import GeneralType from './GeneralType.js'

export class ExploreBuildingScreen extends Component { 
    constructor(props) {
        super(props);
        this.state = {
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
          setQuestions: [],
        };
        this.spacesFilter = this.spacesFilter.bind(this)
        this.assetsFilter = this.assetsFilter.bind(this)
      }

    spacesFilter = (spaceFloor) => {
      console.log(spaceFloor)
      this.state.filteredAssets = this.state.assets.filter(item => item.spaces === spaceFloor)
      console.log(this.state.filteredAssets)
      this.setState({
        spaceSelected: true
      })
    }

    assetsFilter = (assetCategory) => {
      console.log(assetCategory)
      this.state.filteredChecklist = this.state.checklists.filter(item => item.assetCategory === assetCategory || item.assetCategory === "")
      console.log(this.state.filteredChecklist[0].questions)
      
      this.setState({
        assetSelected: true
      })
    }
   
    loadQuestions = (questions) => {
      this.setState({    
        setQuestions: questions,    
        checklistSelected: true    
      })    
    }
    
    componentDidMount = async() => {
      console.log("Befor")
      var orgData =  await this.props.navigation.state.params.orgData
      var buildingData = await this.props.navigation.state.params.buildingData
      var AssetsAndSpaces = await get_building_data(orgData, buildingData)
      this.setState({
        spaces: AssetsAndSpaces.spaces,
        assets: AssetsAndSpaces.assets,
        checklists: orgData.checklists,
        dataLoaded: true,
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

    const Materials = <MaterialsType questionsData = {this.state.MaterialsQuestions}></MaterialsType>
    const Labour = <LabourType questionsData = {this.state.LabourQuestions}></LabourType>
    const General = <GeneralType questionsData = {this.state.GeneralQuestions}></GeneralType>


    if (!this.state.dataLoaded) {
      return(
        <Text>Loading</Text>
      )
    } else if (this.state.dataLoaded){
    return (
      <ScrollView>
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
    <TouchableOpacity >
    <View style={styles.row}>
        <Text style={styles.text}>{item.qrcode}</Text>
    </View>  
  </TouchableOpacity>
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