import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import StatusBar from '../../statusComponent.js';
import { ScrollView } from 'react-native-gesture-handler';

export class SelectOrgScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      org_data: [],
      key: 'GBBNUEFoR1lwQsg/lIyJ5lXcN+ELUowsarB0/HSUl+U='
    };
  }

  componentDidMount = () => {
    this.setState({
      org_data: this.props.navigation.state.params,
    })
  };

  // renderItem({item}) {
  //   return(
  //     <ScrollView>
  //     <View style={styles.row}>
  //       <TouchableOpacity
  //         onPress={() => this.props.navigation.navigate('SelectBuilding')}>
  //       <Text style={styles.text}>{item.name}</Text>
  //       </TouchableOpacity>
  //     </View>
  //     </ScrollView>
      
  //   )
  // }

  render() {
    const {org_data} = this.state;
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <StatusBar/>
        <FlatList 
        data={this.state.org_data}
<<<<<<< Updated upstream
        renderItem={({item}) => 
        <TouchableOpacity onPress={() => this.props.navigation.navigate('SelectBuilding', {
          orgName: item
        })}>
        <View style={styles.row}>
          <Text style={styles.text}>{item.name}</Text>
        </View>  
        </TouchableOpacity>
=======
        renderItem={({ item }) =>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('SelectBuilding', {
            orgName: item
          })}>
            <View style={styles.row}>
              <Text style={styles.text}>{item.name}</Text>
              <View>
                <Icon style={styles.listIcon} name="angle-right" size={30} color="black" />
              </View>
            </View>
          </TouchableOpacity>
>>>>>>> Stashed changes
        }
        keyExtractor={item => item.name}
        />
      </View>
      
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
<<<<<<< Updated upstream
   flex: 1,
   marginTop: 40,
   marginLeft: 15,
   marginRight: 15,
   backgroundColor: '#324679'
=======
    flex: 1,
    marginTop: 40,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#FAF9ED'
>>>>>>> Stashed changes
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
    marginBottom: 3,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  
  },
  text: {
    flex: 1,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30
  },
  
})


export default SelectOrgScreen;
