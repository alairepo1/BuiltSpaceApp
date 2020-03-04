import React, {Component} from 'react';
import { NetworkContext } from '../../statusComponent.js';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

export class SelectOrgScreen extends Component {
  static contextType = NetworkContext;
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

  render() {
    const { org_data } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
      <Text>Connection status: {this.context.isConnected ? 'online' : 'offline'}</Text>
      <FlatList 
        data={this.state.org_data}
        renderItem={({ item }) =>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('SelectBuilding', {
            orgName: item
          })}>
            <View style={styles.row}>
              <Text style={styles.text}>{item.name}</Text>
              <View>
                <Icon style={styles.listIcon} name="angle-right" size={30} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        }
        keyExtractor={item => item.name}
        />
      </View>

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
