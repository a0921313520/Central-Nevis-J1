// import React from "react";
// import { Platform, View, Text, PermissionsAndroid, Image, TouchableOpacity } from "react-native";
// import styles from '$NevisStyles/ScanQRCode'
// import translate from '$Nevis/translate'
// import Verify from './index'
// import ImgIcon from '$NevisStyles/imgs/ImgIcon';
// import ImagePicker from "react-native-image-picker";
// import { launchImageLibrary } from 'react-native-image-picker';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';

// // const devices = useCameraDevices();
// // const device = devices.back;
// //扫码二维码
// class ScanQRCode extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             hasPermission: null,
//         }
//     }

//     async componentDidMount() {
//         // 在页面加载时检查相机权限状态
//         const cameraPermissionStatus = await Camera.getCameraPermissionStatus();
        
//         if (cameraPermissionStatus === 'authorized') { //已经授权
//           //是否登入
//             if(!ApiPort.UserLogin){
//                 //未登入，則引導用戶先進行pwl登入
                
//             }else{
//                 //登入，則啟用相機掃描QR code
//                 this.setState({ hasPermission: true })
//             }

//         } else if (cameraPermissionStatus === 'denied') {
//           // 如果权限被拒绝
//           console.log('Permission Denied', 'Camera access is required to scan QR codes. Please enable it in settings.');
//           this.setState({ hasPermission: false });
//         } else {
//           // 無授权，則请求权限
//           const newPermissionStatus = await Camera.requestCameraPermission();
//           if (newPermissionStatus === 'authorized') {
//             this.setState({ hasPermission: true });
//           } else {
//             this.setState({ hasPermission: false });
//           }
//         }
//     }

//     componentWillUnmount() {

//     }

//     // 后端支持的文件类型=".jpg,.jpeg,.gif,.bmp,.png,.doc,.docx,.pdf"
// 	selectPhotoTapped() {
// 		if (Platform.OS == "ios") {
// 			const options = {
// 				// title: '选择图片', //TODO:CN-DONE 选择图片
// 				// cancelButtonTitle: '取消', //TODO:CN-DONE 取消
// 				// takePhotoButtonTitle: '拍照', //拍照
// 				// chooseFromLibraryButtonTitle: '选择照片',  //從相簿拿圖
// 				cameraType: "back",
// 				mediaType: "mixed",
// 				videoQuality: "high",
// 				durationLimit: 10,
// 				maxWidth: 3000,
// 				maxHeight: 3000,
// 				quality: 1,
// 				angle: 0,
// 				allowsEditing: false,
// 				noData: false,
// 				storageOptions: {
// 					skipBackup: true,
// 					cameraRoll: true,
// 					waitUntilSaved: Platform.OS == "ios" ? true : false,
// 				},
// 				includeBase64: true,
// 				// saveToPhotos: true,
// 			};
// 			if (ImagePicker && typeof ImagePicker.showImagePicker === 'function'){
				
// 				ImagePicker.launchImageLibrary(options, (response) => {
// 					//后缀要求小写
//                     if (response.didCancel) {
//                     }else{
//                         if (response.data) {
//                             const names = response.fileName || (response.uri && response.uri.split('/').slice(-1)[0])
//                             let idx = names.lastIndexOf(".");
//                             let newfileName = names.substring(0, idx) + names.substring(idx).toLowerCase();
//                             let uploadProgress = response.fileSize;
//                             this.setState({
//                                 uploadModalVisible: false,
//                                 avatarName: newfileName,
//                                 avatarSize: response.fileSize,
//                                 avatarSource: response.data,
//                                 uploadSpeed: uploadProgress,
//                             });
//                         }
//                     }
// 				});

// 			}else{
//                 launchImageLibrary(options, (response) => {
//                     console.log('MMLB response>>>',response)
//                     if (response.didCancel) {} else{
//                     //后缀要求小写
//                     if (response.assets[0]) {
//                         const names = response.assets[0].fileName || (response.assets[0].uri && response.assets[0].uri.split('/').slice(-1)[0])
//                         let idx = names.lastIndexOf(".");
//                         let newfileName = names.substring(0, idx) + names.substring(idx).toLowerCase();
//                         let uploadProgress = response.assets[0].fileSize;
//                         this.setState({
//                             uploadModalVisible: false,
//                             avatarName: newfileName,
//                             avatarSize: response.assets[0].fileSize,
//                             avatarSource: response.assets[0].data,
//                             uploadSpeed: uploadProgress,
//                         });
//                     }
//                     }
//                 });
                
// 			}

// 		} else {
// 			DocumentPicker.pick({
// 				type: ['image/jpeg', 'image/png', 'image/gif', 'public.heic', 'public.heif', 'public.jpeg', 'public.png', 'com.compuserve.gif', DocumentPicker.types.pdf,],
// 			})
// 				.then(res => {
// 					if (res.name != null) {
// 						//獲取base64 
// 						RNFS.readFile(res.uri, 'base64').then(data => {
// 							let idx = res.name.lastIndexOf('.');
// 							let newfileName = res.name.substring(0, idx) + res.name.substring(idx).toLowerCase();
// 							let uploadProgress = res.size
// 							this.setState({
// 								uploadModalVisible: false,
// 								avatarName: newfileName,
// 								avatarSize: res.size,
// 								avatarSource: data,
// 								uploadSpeed: uploadProgress,
// 							});

// 						})

// 					}

// 				});
// 		}
// 	}

//     onSuccess = (e) => {
//         // This function handles the success when a QR code is scanned.
//         try {
//             // 檢查掃描結果是否有效
//             if (e && e.data) {
//                 console.log('顯示掃描到的 QR code 數據---->',e);// 顯示成功掃描到的 QR Code
//                 this.setState({
//                     isScanning: false, // 掃描成功後關閉掃描界面
//                 }) 
//                 window.validCode();
//             } else {
//                 window.invalidCode();
//                 throw new Error('無效的 QR Code，請重新掃描');
//             }
//           } catch (error) {
//             console.log('error',error)
//             this.handleError();
//           }
//     };

//     handleError = () => {
//         // 錯誤處理：提示用戶
//         window.invalidCode()
//     };


//     render() {
//         const { modeType } = this.props
//         const { hasPermission } = this.state;

//         // 如果尚未获取权限状态
//         if (hasPermission === null)  { return }
  
//         // 如果权限被拒绝
//         if (!hasPermission) { return }
  
//         // 如果有权限，显示二维码扫描页面
//         return (
//             <View style={{ flex: 1, backgroundColor: "#000000" }}>
//                 <View style={styles.faceBG}>    
//                     <View style={styles.user}>
//                         <View>
//                             <QRCodeScanner
//                                 onRead={this.onSuccess}
//                                 //flashMode={RNCamera.Constants.FlashMode.auto} // 自動閃光燈
//                                 topContent={<Text style={styles.nameStyle}>{translate("请扫描竞博网页上所显示的二维码")}</Text>}
//                                 bottomContent={
//                                     <TouchableOpacity onPress={this.selectPhotoTapped}>
//                                         <View style={styles.guestViewMode}>
//                                             <Image
//                                                 resizeMode="stretch"
//                                                 source={ImgIcon['photoAlbum']}
//                                                 style={{ width: 30, height: 27 }}
//                                             />
//                                             <Text style={{ color: '#CCCCCC', fontSize: 14, marginTop: 5 }}>
//                                                 {translate('相簿')}
//                                             </Text>
//                                         </View>
//                                     </TouchableOpacity> 
//                                 }
//                                 cameraStyle={styles.camera}
//                             />
//                         </View>
//                     </View>          
//                 </View>
//                 {
//                     modeType != '' &&
//                     <Verify
//                         modeType={modeType}
//                         onSuccess={() => { }}//验证/添加成功
//                         onError={() => { }}//验证/添加失败
//                     />
//                 }
//             </View>
//         )
//     }
// }



// export default ScanQRCode
