import React, {Component} from 'react';
import {Platform} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
// import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import LoadingScreen from '../screens/LoadingScreen/loadingScreen.js';
import LoginScreen from '../screens/LoginScreen/LoginScreen.js';
import HomeScreen from '../screens/HomeScreen/HomePage.js';
import SelectOrgScreen from '../screens/Operations/SelectOrgScreen.js';
import SelectBuildingScreen from '../screens/Operations/SelectBuildingScreen.js';
import SelectAssetScreen from '../screens/Operations/SelectAssetScreen.js';
import SelectLocationScreen from '../screens/Operations/SelectLocationScreen.js';
import BuildingDetailsScreen from '../screens/Operations/BuildingDetailsScreen';
import AssetScreen from '../screens/IsolatedChecklist/AssetScreen.js';




const AuthStack = createStackNavigator(
  // Login Screen
  {
    LoginScreen: {
      screen: LoginScreen
    },
  },
  {
    initialRouteName: 'LoginScreen',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#436FA1',
      },
      cardStyle: {backgroundColor: '#324679'},
      headerTintColor: 'white'
    }
  }
);

// add a new screen here
const HomeStack = createStackNavigator(
  
  {
    
    Home: {
      screen: HomeScreen
    },
    // Operation Screens below
    Organization: {
      screen: SelectOrgScreen
    },
    SelectBuilding: {
      screen: SelectBuildingScreen
    },
    BuildingDetails: {
      screen: BuildingDetailsScreen
    },
    SelectLocation: {
      screen: SelectLocationScreen
    },
    SelectAsset: {
      screen: SelectAssetScreen
    },
    // Add Operation screens above
    //
    // Isolated Checklist Screens below
    Assets: {
        screen: AssetScreen
    },
    // Add Isolated Checklist screens above
  },
  
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#436FA1',
      },
      cardStyle: {backgroundColor: '#324679'},
      headerTintColor: 'white'
    }
  },

);


// const SelectBuildingStack = createStackNavigator({
//   SelectBuilding: {
//     screen: SelectBuilding,
//   },
// });

// const Feature3Stack = createStackNavigator({
//   Feature3: {
//     screen: Feature3Page,
//   },
// });

// const AppStack = createBottomTabNavigator(
//   {
//     Home: {
//       screen: HomeStack,
//     },
//     SelectOrgScreen: {
//       screen: SelectOrgScreenStack,
//     },
//     SelectBuilding: {
//       screen: SelectBuildingStack,
//     },
//     Feature3: {
//       screen: Feature3Stack,
//     },
//   },
//   {
//     initialRouteName: 'Home',
//   },
// );

export default createAppContainer(
  createSwitchNavigator(
    {
      HomeStack: HomeStack,
      Auth: AuthStack,
      LoadingScreen,
    },
    {
      initialRouteName: 'LoadingScreen',
    },
  ),
);
