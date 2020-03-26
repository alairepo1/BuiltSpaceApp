import React, {Component} from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

class ExploreBuildingFlatlistFooter extends Component {
     constructor(props){
         super(props)
     }
     render(){
         return(
            <View style={{flex: 3, flexDirection: 'row'}}>
                <TouchableOpacity onPress={()=>{ this.props.addQuestion("labour")}} style={{flex: 1}}>
                <Text>Add labour</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{ this.props.addQuestion("materials")}} style={{flex: 1}}>
                <Text>Add materials</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> this.props.addQuestion("issue")} style={{flex: 1}}>
                <Text>Add issue</Text>
                </TouchableOpacity>
            </View>
         )
     }
}

export default ExploreBuildingFlatlistFooter