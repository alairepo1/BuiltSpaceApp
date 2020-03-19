import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, FlatList, ListItem} from 'react-native';
import StatusBar from '../../statusComponent.js';
import { BorderlessButton } from 'react-native-gesture-handler';

import SamsListItem from './SamsListItem'

export class AssetScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AssetCategories: [],
      Checklist: [],
      key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=',
      checklistLoading: true,
      assetCategoryLoading: true,
      categorypassed: false,
      selectedcategory: null,
      filteringdone: false,
      filteredChecklist: []
    };
  
  this.fetchChecklist = this.fetchChecklist.bind(this)
  this.fetchAssetCategory = this.fetchAssetCategory.bind(this)
  this.checklistFilter = this.checklistFilter.bind(this)
  }
  fetchAssetCategory = () => { 
    fetch('https://beta.builtspace.com/sites/bcitproject/_vti_bin/wcf/orgdata.svc/v2/AssetCategories',
    {
      method: 'get',
      headers: {
        Authorization: this.state.key
      },
    },
    ).then(response => response.json())
    .then(results => {
      this.setState({
        AssetCategories: results,
        assetCategoryLoading: false,
        
      })
    })
  };
  
  fetchChecklist = () => { 
    fetch('https://beta.builtspace.com/sites/bcitproject/_vti_bin/wcf/orgdata.svc/procedures',
    {
      method: 'get',
      headers: {
        Authorization: this.state.key
      },
    },
    ).then(response => response.json())
    .then(results => {
      
      this.setState({
        Checklist: results,
        checklistLoading: false
      })
    })
  };
  componentDidMount = () => {
    this.fetchChecklist();
    this.fetchAssetCategory()
  };

  checklistFilter = (categoryabbreviation) => {
    this.setState({
      selectedcategory: categoryabbreviation,
      categorypassed: true
    })
    console.log("aadsads" + this.state.selectedcategory)
  this.state.filteredChecklist = this.state.Checklist.filter(item => item.assetCategory === categoryabbreviation | item.assetCategory === "")
  console.log(this.state.filteredChecklist)
  console.log(this.state.categorypassed)
  console.log(this.state.selectedcategory)
  this.setState({
    filteringdone: true
  })
  }
render() {
  console.log(this.state.filteredChecklist)
  console.log(this.state.categorypassed)
  if (this.state.assetCategoryLoading) {
    return (
    <View><Text>Loading</Text></View>);
  } 
  else if (this.state.filteringdone) {
    console.log(this.state.filteredChecklist)
    return (
    <View>
      <Text style={styles.header}>Checklist</Text>
      <FlatList
        data={this.state.filteredChecklist}
        renderItem = {({item}) => 
        <SamsListItem
        styles={styles}
        categoryabbreviation={item.assetCategory}
        checklistId={<Text style={styles.title}>Checklist Id: {item.id}</Text>}
        title={item.title}
        workcategory={item.workCategory}
        onPress={() => {
          console.log("dope")
        }
      }></SamsListItem>
        }
        keyExtractor={item => item.id}
        />
    </View>
    )}
  else {
  return (
    <View>
      <Text style={styles.header}>Fetch Asset and Checklist API</Text>
      <FlatList 
                data={this.state.AssetCategories}
                renderItem = {({item}) => 
               <SamsListItem
               categoryabbreviation={item.categoryabbreviation}
               styles={styles}
               onPress={() => {
                console.log("on press category " +item.categoryabbreviation)
                console.log(this.state.categorypassed)
              this.checklistFilter(item.categoryabbreviation)
            }
            }></SamsListItem>
                }
                keyExtractor={item => item.id}
                />
                </View>
              )}
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center'

  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    alignItems: 'center'
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default AssetScreen;
