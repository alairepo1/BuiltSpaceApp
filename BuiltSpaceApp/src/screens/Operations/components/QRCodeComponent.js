import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Alert, PermissionsAndroid} from 'react-native';
import {CameraKitCameraScreen} from 'react-native-camera-kit';
import styles from '../BuildingScreen.style.js';
import Icon from 'react-native-vector-icons/FontAwesome';

class QRCodeComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      startScanner: false
    }
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
            that.setState({qrCodeValue: ''});
            // that.props.setScannerState(true)
            that.setState({startScanner: true})
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
      that.setState({qrCodeValue: ''});
      // that.props.setScannerState(true)
      that.setState({startScanner: true})
    }
  };

  onQRCodeScanDone = qrCode => {
    Alert.alert(
      'QR Code details',
      `Details: ${qrCode}`,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );

    that.setState({qrCodeValue: qrCode});
    // that.props.setScannerState(false)
    that.setState({startScanner: false})
  };

  render() {
    return (
      <View>
        {!this.state.startScanner ? 
                <TouchableOpacity onPress={this.openQRCodeScanner}>
                <View style={styles.row}>
                  <Text style={styles.text}>Scan Qr</Text>
                  <View>
                    <Icon
                      style={styles.listIcon}
                      name="angle-right"
                      size={30}
                      color="black"
                    />
                  </View>
                </View>
              </TouchableOpacity>
        :
        <View style={{flex: 1}}>
          <CameraKitCameraScreen
            showFrame={true}
            scanBarcode={true}
            laserColor={'#FF3D00'}
            frameColor={'#00C853'}
            colorForScannerFrame={'black'}
            onReadCode={event =>
              this.onQRCodeScanDone(event.nativeEvent.codeStringValue)
            }
          />
        </View>
        }
      </View>
    );
  }
}



export default QRCodeComponent;
