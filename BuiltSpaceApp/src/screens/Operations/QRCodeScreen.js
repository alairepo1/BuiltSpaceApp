import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Alert, PermissionsAndroid} from 'react-native';
import {CameraKitCameraScreen} from 'react-native-camera-kit';
import {loadQRMapping} from '../../functions/functions.js'
import {ContextInfo} from '../../ContextInfoProvider';

class QRCodeComponent extends Component {
  static contextType = ContextInfo

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

  onQRCodeScanDone = qrCodeResult => {
    // var qrcodes = this.props.navigation.state.params.qrcodes

    var qrcodes = [{ // this is mock data, replace this with the commented qrcode above.
      "assetid": null,  // we are using mock data because our test account does not contain any qrqode mappings
      "buildingid": 3221,
      "contactperson": null,
      "id": 1,
      "spaceid": 4,
      "url": "01"
    },
    {
      "assetid": 24044,
      "buildingid": 3221,
      "contactperson": null,
      "id": 2,
      "spaceid": null,
      "url": "02"
    },
  ] 
  var findQR = loadQRMapping(qrcodes, qrCodeResult)

    if (!findQR){
      this.alertQRcode()
    }else{
      this.alertQRcode(findQR)
      
    }
    // this.setState({qrCodeValue: qrCode});
    this.setState({isLoading: false})
  };

  alertQRcode = (findQR) => {
    Alert.alert(
      `QR Code Details ` ,
      `QR code is mapped to , Do you want to start an inspection?, \n Details: ${findQR}`,
      [{text: 'OK', onPress: () => {
        this.props.navigation.state.params.loadQRCode(findQR)
        this.props.navigation.goBack()
      }
    }],
      {cancelable: false},
    );
  }

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
