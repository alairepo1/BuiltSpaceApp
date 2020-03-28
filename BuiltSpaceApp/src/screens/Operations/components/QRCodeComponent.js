import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {CameraKitCameraScreen} from 'react-native-camera-kit';

class QRCodeComponent extends Component {
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
            that.setState({startScanner: true});
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
      that.setState({startScanner: true});
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

    this.setState({startScanner: false});
  };

  openLink = () => {
    Linking.openURL(this.state.qrCodeValue);
  };

  render() {
    return (
      <View>
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
      </View>
    );
    return (
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
      );
  }
}



export default QRCodeComponent;
