import {StyleSheet} from 'react-native';

export default StyleSheet.create({
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

        detailsText: {
        color: 'red',
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
        // marginTop: 170,
        marginRight: 15,
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        },
        text: {
        flex: 1,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 25,
        },
        flatList: {
        backgroundColor: '#FAF9ED',
        },
        addQuestionButton: {
        padding: 10, 
        margin: 10, 
        backgroundColor: '#47d66d',
        } 
})