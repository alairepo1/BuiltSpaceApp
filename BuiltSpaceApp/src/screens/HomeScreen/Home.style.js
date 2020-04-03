import { StyleSheet } from 'react-native';

export default StyleSheet.create ({
    container: {
        // flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    homePageText: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
    },
    button_view: {
        // flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#FAF9ED',
        marginTop: 15,
    },
    button_container: {
        width: 240,
        alignSelf: 'center',
        margin: 10,
    },
    buttons: {
        backgroundColor: '#ABA9A9',
        margin: 5,
        color: 'black',
        height: 50,
    },
    button_text: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 13,
    },
    inspectionContainer: {
        alignSelf: 'center',
        width: '100%',
        margin: 5
    },
    inspectionRow: {
        flex: 2,
        flexDirection: 'row',
    },
    checkbox: {
        flex: 1
    },
    inspectionButtonContainer: {
        flexDirection: 'row',
        marginLeft: 15
    },
    inspectionName: {
        flex: 1,
        fontSize: 15
    },
    submit:{
        width: 100,
        height: 40,
        padding: 10,
        margin: 5,
        backgroundColor: '#6CD938',
    },
    delete:{
        width: 100,
        height: 40,
        padding: 10,
        margin: 5,
        backgroundColor: 'red',
    }
});