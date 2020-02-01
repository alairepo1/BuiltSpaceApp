/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';

import BottomTabNavigator from './src/BottomTabNavigator.js';
import Navigator from './src/Navigator/Navigator.js';
import SafeAreaView from 'react-native-safe-area-view';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import RealmDb from './realmdb.js';

class App extends Component {
  render() {
    return (
      <SafeAreaProvider>
        {/* <Text>Hello</Text> */}
        <Navigator />
        {/* <RealmDb /> */}
      </SafeAreaProvider>
    );
    // <BottomTabNavigator />;
  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// const Realm = require('realm');

// class RealmDB extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {realm: null};
//   }

//   componentDidMount() {
//     Realm.open({
//       schema: [{name: 'Dog', properties: {name: 'string'}}],
//     }).then(realm => {
//       console.log(realm.objects('Dog'));
//       this.setState({realm});
//     });

//     const {realm} = this.state;
//     if (realm !== null && !realm.isClosed) {
//       realm.close();
//     }
//   }

//   add_dog() {
//     //    console.log("add dog")
//     Realm.open({
//       schema: [{name: 'Dog', properties: {name: 'string'}}],
//     }).then(realm => {
//       realm.write(() => {
//         realm.create('Dog', {name: 'Rex'});
//       });
//       console.log(realm.objects('Dog'));
//       this.setState({realm});
//     });
//   }

//   remove_dog() {
//     console.log('Hello');
//   }

//   render() {
//     const info = this.state.realm
//       ? 'Number of dogs in this Realm: ' +
//         this.state.realm.objects('Dog').length
//       : 'Loading...';
//     return (
//       <View style={styles.container}>
//         <Text>Hello</Text>
//         <Text style={styles.welcome}>{info}</Text>
//         <Button
//           title="add"
//           onPress={() => {
//             this.add_dog();
//           }}
//         />

//         <Button
//           title="remove"
//           onPress={() => {
//             this.remove_dog();
//           }}
//         />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default RealmDB;
