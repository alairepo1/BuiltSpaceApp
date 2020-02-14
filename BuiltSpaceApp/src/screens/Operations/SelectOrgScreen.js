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

  fetch = () => {
    fetch(
        'https://beta.builtspace.com/_vti_bin/wcf/userdata.svc/MyOrganizations', //get organizations
        {
          method: 'get',
          headers: {
            Authorization: this.state.key
          },
        },
    )
        .then(response => response.json())
        .then(result => {
          
          this.setState({
            org_data: result
          })
        })
        .catch(e => {
          console.log(e);
        });
  };

  componentDidMount = () => {
    this.fetch();
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
        <FlatList style={styles.container}
        data={this.state.org_data}
        renderItem={({item}) => 
        <TouchableOpacity onPress={() => this.props.navigation.navigate('SelectBuilding', {
          orgName: item.name
        })}>
        <View style={styles.row}>
          <Text style={styles.text}>{item.name}</Text>
        </View>  
        </TouchableOpacity>
        }
        keyExtractor={item => item.name}
        />
      
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   marginTop: 40,
   marginLeft: 15,
   marginRight: 15,
   backgroundColor: '#324679'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
    marginBottom: 3,
    borderBottomColor: 'white',
    borderBottomWidth: 2,
  
  },
  text: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30
  },
  
})


export default SelectOrgScreen;
