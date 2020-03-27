import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#FAF9ED',
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 16,
        marginBottom: 3,
        marginLeft: 15,
        marginTop: 15,
        marginRight: 15,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
      },
      text: {
        flex: 1,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 25,
    
    
      },
      detailsTextContainer: {
        padding: 15
      },
      detailsTextBold: {
        flex: 1,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 14,
    
      },
      detailsText: {
        color: 'black',
        fontWeight: 'normal',
        fontSize: 14,
    
      },
      flatList: {
        backgroundColor: '#FAF9ED',
      }
})