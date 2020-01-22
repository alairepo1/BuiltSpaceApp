import React, { Component } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import PropTypes from "prop-types";
import StatusBar from "../../statusComponent.js";

export class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Store user api key for reuse here?
      api_key: "GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U=",
      email: "<fetch sign in email>",
      connection_status: "Not implemented",
      organization: "<fetch selected org>"
    };
  }

  notImplemented = () => {
    Alert.alert(
      "Not Implemented",
      "Button is not implemented yet",
      [
        {
          text: "Close",
          onPress: () => console.log("Not implemented"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  };

  fetchAPI = () => {
    fetch(
      "https://beta.builtspace.com/_vti_bin/wcf/userdata.svc/MyOrganizations",
      {
        method: "get",
        headers: {
          Authorization: this.state.api_key
        }
      }
    )
      .then(response => response.json())
      .then(result => {
        // returns an array of organization objects
        // Implement a chooser that will set state to selected organization
        this.setState({
          organization: result[0].name
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  componentDidMount = () => {
    // initialize the api here
    this.fetchAPI();
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          email={this.state.email}
          organization={this.state.organization}
          connection_status="Not implemented"
        />

        <View style={styles.button_view}>
          <View style={{ flex: 1 }}>
            <View style={styles.button_container}>
              <Button
                style={styles.buttons}
                title="My Schedule"
                onPress={this.notImplemented}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.button_container}>
              <Button
                style={styles.buttons}
                title="All work items"
                onPress={this.notImplemented}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  button_view: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgrey"
  },
  button_container: {
    width: 140,
    alignSelf: "center"
  },
  buttons: {}
});

export default HomePage;
