import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableHighlight,
  Image,
  Text,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  Button
} from 'react-native';

export default class FlatListComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      source: 'null',
      article: [],
      uri: this.props.uri,
      search: 'nothing found',
    };
    this.arrayholder = []
  }

  static defaultProps = {
    uri: `https://newsapi.org/v2/everything?q=politics&apiKey=083db73937c04e1a9bf33cbbb0198ac3`,
  };

  fetchTodos() {
    fetch(this.state.uri)
      .then(response => response.json())
      .then(source => {
        var article = source.articles
          this.setState({
            article,
            source
          });
          this.arrayholder = article;
      });

  }

  componentDidMount() {
    this.fetchTodos();
  }

  searchFilterFunction = (text) => {
    this.setState({
      search: text
    });
    const newData = this.arrayholder.filter(item=>{
      const itemData = `${item.description} ${item.title} ${item.content}  ${item.url} ${item.title}`
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      article: newData,
    });
  };

  
  render() {
    const {navigate} = this.props.navigation
    return (
      <View style={styles.topContainer}>
        <View style={styles.searchContainer}>
        <TextInput
          style={styles.textinput}
          placeholder="Search by key word"
          onSubmitEditing={(e) => 
            this.searchFilterFunction(e.nativeEvent.text)}
          clearButtonMode='always'
        />       
        <Button
        title="clear "
        onPress={()=> this.searchFilterFunction(" ")}
        />
        </View>


        <View style={{flex: 1}}>
          {this.state.article.length > 0 ? 
        <FlatList
        style={styles.flatlist}
        data={this.state.article}
        extraData={this.state.article}
        renderItem={({ item }) =>
        <View style={styles.rowContainer}>
        <Image
          source={{ uri: item.urlToImage }}
          style={{ height: 120, width: 75 }}
        />
        <View style={styles.row}>
          <Text style={styles.textTitle}>{item.title}</Text>
          <Text style={{flex: 1}}>{item.source.name}, {item.author}</Text>
        <Button
        style={{flex:1}}
        title="Read"
        onPress={() => navigate('Article', item)}
        />
        </View>
      </View>
      }
        keyExtractor={item => item.url}
      /> : <Text>No results for: {this.state.search}</Text>  
        }
      
      </View>
          </View>
    );
  }

}

const styles = StyleSheet.create({
  topContainer: {
    flex:3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  searchContainer: {
    flexDirection: "row"
  },
  flatlist: {
    backgroundColor: 'lightgrey',
    },
  textinput: {
    alignContent: 'center',
    textAlign: 'center',
    margin: 5,
    height: 40,
    width: 250,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'white'
  },
  rowContainer: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: 'white',
    marginBottom: 3,
    height: 150,
    width: 400,
  },
  row : { flex: 3, flexDirection: 'column', padding: 10 },
  textTitle: { flex: 1, color: 'black', fontWeight: 'bold' },
  header:{
    fontSize: 28
  }
});
