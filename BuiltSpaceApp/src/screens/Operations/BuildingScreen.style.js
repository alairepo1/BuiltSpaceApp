import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: 'white',
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
        backgroundColor: 'white',
    },
    TextContainer: {
        padding: 15,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRightColor: 'red',
        borderRightWidth: 50
    },
    TextContainerSelected: {
        padding: 15,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRightColor: 'green',
        borderRightWidth: 50
    },
    headingTextBold: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'flex-start'
    },
    questionsHeader: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'flex-start',
        padding: 5
        
    },
    addQuestionButton: {
        padding: 10, 
        margin: 10, 
        backgroundColor: '#47d66d',
    },
    listIcon: {
        justifyContent: 'flex-end',
        textAlign: "right"
    },
    select_container: {
        flex: 1,
        marginTop: 40,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: 'white',
    },
    select_row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 16,
        marginBottom: 3,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },

});