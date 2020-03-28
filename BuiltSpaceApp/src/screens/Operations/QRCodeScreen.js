import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Alert, PermissionsAndroid} from 'react-native';
import {CameraKitCameraScreen} from 'react-native-camera-kit';
import styles from './BuildingScreen.style.js';
import Icon from 'react-native-vector-icons/FontAwesome';

class QRCodeComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
        isLoading: false
    }
  }

  componentDidMount = () => {
      this.openQRCodeScanner
  }

  openQRCodeScanner = () => {
    var that = this;

    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'BuiltSpace App Permission',
              message: 'Builtspace needs access to your camera ',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // this.props.setQRState();
            this.setState({qrCodeValue: ''});
          } else {
            alert('CAMERA permission denied');
          }
        } catch (err) {
          alert('Camera permission err', err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      this.setState({qrCodeValue: ''});
    }
  };

  onQRCodeScanDone = qrCode => {
    Alert.alert(
      'QR Code details',
      `Details: ${qrCode}`,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );

    this.setState({qrCodeValue: qrCode});
    this.setState({isLoading: false})
  };

  render() {
    return (
        <View style={{flex: 1}}>
            {/* {this.state.isLoading ? 
            <View style={styles.loadingIndicator}>
                <ActivityIndicator />
                <Text>Wait while we fetch the qrcode URL ...</Text>
            </View>    
        : null } */}
          <CameraKitCameraScreen
            showFrame={true}
            scanBarcode={true}
            laserColor={'#FF3D00'}
            frameColor={'#00C853'}
            colorForScannerFrame={'black'}
            onReadCode={event => {
                this.setState({isloading: true})
                this.onQRCodeScanDone(event.nativeEvent.codeStringValue)
                }
            }
          />
        </View>
    );
  }
}



export default QRCodeComponent;
