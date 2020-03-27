import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    textContainer: {
        padding: 15,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRightColor: 'red',
        borderRightWidth: 50
      },
      textContainerSelected: {
        padding: 15,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRightColor: 'green',
        borderRightWidth: 50
      },
      optionText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30
      },
      titleTop: {
        backgroundColor: '#FAF9ED',
        width: '100%',
        height: 50
      },
      headingTextBold: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'center'
    
      },
      detailsText: {
        color: 'red',
        fontWeight: 'normal',
        fontSize: 16,
        alignSelf: 'center'
      },
      detailsTextSelected: {
        color: 'green',
        fontWeight: 'normal',
        fontSize: 16,
        alignSelf: 'center'
      },
      row: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            padding: 16,
            marginBottom: 3,
            marginLeft: 15,
            marginTop: 170,
            marginRight: 15,
            borderBottomColor: 'white',
            borderBottomWidth: 2,
        },
    
      text: {
        flex: 1,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25,
      },
      flatList: {
        backgroundColor: '#FAF9ED',
      },
      assetListItems: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ABA9A9',
      },
      listContainer: {
        marginTop: 10,
        flex: 1,
      },
      bottomContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#FAF9ED',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
      },
      listText: {
        justifyContent: 'flex-start',
        fontSize: 15,
        padding: 2
      },
      closeButton: {
        textAlign: "center",
        color: 'black',
        fontSize: 25,
      },
      listIcon: {
        paddingRight: 15,
        paddingLeft: 10
      },
      listIconContainer: {
        paddingVertical: 10,
        paddingRight: 10,
        flexDirection: "row",
        alignItems: "center"
      }
})