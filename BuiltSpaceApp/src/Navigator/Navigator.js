import React, { Component } from 'react';
import { Platform } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoadingScreen from '../screens/AuthLoadingScreen/AuthloadingScreen.js';
import Login from '../screens/LoginScreen/Login.js';
import HomeScreen from '../screens/HomeScreen/HomePage.js';
import SelectOrgScreen from '../screens/Operations/SelectOrgScreen.js';
import SelectBuildingScreen from '../screens/Operations/SelectBuildingScreen.js';
import BuildingDetailsScreen from '../screens/Operations/BuildingDetailsScreen.js';
import ExploreBuildingScreen from '../screens/Operations/ExploreBuildingScreen.js'
import QRCodeScreen from '../screens/Operations/QRCodeScreen.js'
import CameraComponent from '../screens/Operations/components/CameraComponent.js'
import GeneralType from '../screens/Operations/components/GeneralType.js'


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
        backgroundColor: '#43BC4F',
      },
      cardStyle: { backgroundColor: '#324679' },
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
    ExploreBuilding: {
      screen: ExploreBuildingScreen
    },
    QRCode:{
      screen: QRCodeScreen,
      headerShown: false
    },

    GeneralType: {
      screen: GeneralType
    },
    CameraComponent: {
      screen: CameraComponent,
      headerShown: false
    }
  },

  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#43BC4F',
      },
      cardStyle: { backgroundColor: 'white' },
      headerTintColor: 'white'
    }
  },
  

);

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
