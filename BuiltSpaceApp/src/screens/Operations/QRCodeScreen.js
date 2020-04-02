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
          } else {
            alert('CAMERA permission denied');
          }
        } catch (err) {
          alert('Camera permission err', err);
          console.warn(err);
        }
      }
      requestCameraPermission();
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
      this.filterQR(findQR)
      
    }
    this.setState({isLoading: false})
  };

  filterQR = (qrMap) => {
    var checklists = this.props.navigation.state.params.checklists

    if (qrMap.assetid == null) {
      // filter space based on qrcode spaceid
      var findSpace = this.props.navigation.state.params.spaces.find(space => space.id == qrMap.spaceid)
      
      // filter assets based on space floor
      var filteredAssets = this.props.navigation.state.params.assets.filter(item => item.spaces == findSpace.floor)

      // filter checklist based on the assets available
      var filteredChecklist = []

      for (var checklist_index=0; checklist_index < checklists.length ; checklist_index ++){
        if (checklists[checklist_index].assetCategory == ""){filteredChecklist.push(checklists[checklist_index])}
        for (var asset_index=0; asset_index < filteredAssets.length; asset_index++){
          if (filteredAssets[asset_index].categoryabbr == checklists[checklist_index].assetCategory){
            filteredChecklist.push(checklists[checklist_index])
          }
        }
      }
      this.alertQRcode('space', 
      findSpace.floor, 
      qrMap.spaceid,
      filteredAssets,
      filteredChecklist)
    }else {
      // filter assets based on qrcode assetid
      var asset = this.props.navigation.state.params.assets.find(asset => asset.id === qrMap.assetid)

      // filter checklist based on asset category
      var filteredChecklist = checklists.filter(item => 
        item.assetCategory == asset.categoryabbr || item.assetCategory === ""
      )

      // check if there are any checklists filtered
      if (filteredChecklist.length > 0){
        var findAsset = this.props.navigation.state.params.assets.find(asset => asset.id == qrMap.assetid)
        
        this.alertQRcode('asset', 
        findAsset.name, 
        qrMap.assetid,
        null,
        filteredChecklist)
      }
    }
    
  }

  alertQRcode = (type, type_name, typeid, filteredAssets = null, filteredChecklist) => {
    Alert.alert(
      `QR Code Details `,
      `QR code is mapped to ${type_name}, Do you want to start an inspection?`,
      [{text: 'OK', onPress: () => {
        this.props.navigation.state.params.loadQRCode(type, 
        type_name, 
        typeid,
        filteredAssets,
        filteredChecklist
        )
        this.props.navigation.goBack()
      }
    }],
      {cancelable: false},
    );
  }

  render() {
    return (
        <View style={{flex: 1}}>
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
