import React, { Component } from "react";
import { Platform } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import LoadingScreen from "../screens/LoadingScreen/loadingScreen.js";
import LoginScreen from "../screens/LoginScreen/LoginScreen.js";
import HomeScreen from "../screens/HomeScreen/HomePage";
import Feature1Page from "../screens/Feature1/Feature1Page";
import Feature2Page from "../screens/Feature2/Feature2Page";
import Feature3Page from "../screens/Feature3/Feature3Page";

const AuthStack = createStackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen
    }
  },
  { initialRouteName: "LoginScreen" }
);

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen
  }
});

const Feature1Stack = createStackNavigator({
  Feature1: {
    screen: Feature1Page
  }
});

const Feature2Stack = createStackNavigator({
  Feature2: {
    screen: Feature2Page
  }
});

const Feature3Stack = createStackNavigator({
  Feature3: {
    screen: Feature3Page
  }
});

const AppStack = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarIcon: ({ iconColor }) => (
          <MaterialCommunityIcons name="home" size={35} color={iconColor} />
        )
      }
    },
    Feature1: {
      screen: Feature1Stack,
      navigationOptions: {
        tabBarIcon: ({ iconColor }) => (
          <MaterialCommunityIcons
            name="numeric-1-box-outline"
            size={35}
            color={iconColor}
          />
        )
      }
    },
    Feature2: {
      screen: Feature2Stack,
      navigationOptions: {
        tabBarIcon: ({ iconColor }) => (
          <MaterialCommunityIcons
            name="numeric-2-box-outline"
            size={35}
            color={iconColor}
          />
        )
      }
    },
    Feature3: {
      screen: Feature3Stack,
      navigationOptions: {
        tabBarIcon: ({ iconColor }) => (
          <MaterialCommunityIcons
            name="numeric-3-box-outline"
            size={35}
            color={iconColor}
          />
        )
      }
    }
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      App: AppStack,
      Auth: AuthStack,
      LoadingScreen
    },
    {
      initialRouteName: "LoadingScreen"
    }
  )
);
