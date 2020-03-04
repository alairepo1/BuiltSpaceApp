import React, {Component} from 'react';
import {Platform} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
// import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import LoadingScreen from '../screens/LoadingScreen/loadingScreen.js';
import Login from '../screens/LoginScreen/Login.js';
import HomeScreen from '../screens/HomeScreen/HomePage.js';
import SelectOrgScreen from '../screens/Operations/SelectOrgScreen.js';
import SelectBuildingScreen from '../screens/Operations/SelectBuildingScreen.js';
import SelectAssetScreen from '../screens/Operations/SelectAssetScreen.js';
import SelectLocationScreen from '../screens/Operations/SelectLocationScreen.js';
import BuildingDetailsScreen from '../screens/Operations/BuildingDetailsScreen.js';
import ExploreBuildingScreen from '../screens/Operations/ExploreBuildingScreen.js'

const AuthStack = createStackNavigator(
  {
    Login: {
      screen: Login
    },
  },
  {
    initialRouteName: 'Login',
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
      screen: SelectOrgScreen,
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
    ExploreBuilding: {
      screen: ExploreBuildingScreen
    }
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
