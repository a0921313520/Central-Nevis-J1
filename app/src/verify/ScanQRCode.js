import React, { useEffect, useState } from 'react';
import { Platform, Image, StyleSheet, Text, View, Alert } from 'react-native';
import {
    check as checkPermission,
    PERMISSIONS,
    request as requestPermission,
    RESULTS,
} from 'react-native-permissions';
import Touch from 'react-native-touch-once';
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import translate from '$Nevis/translate'
import Modals from '$Nevis/src/Modals'
import { RNCamera } from 'react-native-camera'
import { Actions } from "react-native-router-flux";
import { WebView } from 'react-native-webview';
import ReadImageQrCode from './ReadImageQrCode'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Camera, useCameraDevices, useCodeScanner, useCameraDevice } from 'react-native-vision-camera';
import { NevisErrs } from '../InitClient'

const ReadQrCodeScreen = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [qrCodeDate, setQrCodeDate] = useState('');
    const [QrcodeInvalid, setQrcodeInvalid] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [validCodeModal, setValidCodeModal] = useState(false);
    const [base64Image, setBase64Image] = useState('');  

    const isIos = Platform.OS === 'ios'
    const device = isIos && useCameraDevice('back') || false
    const cameraPermission = isIos ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

    // 在组件挂载时检查权限
    useEffect(() => {
        const checkAndRequestPermission = async () => {
            const result = await checkPermission(cameraPermission);
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    setErrorMessage(translate('相机在此设备上不可用'));
                    break;
                case RESULTS.DENIED:
                    requestCameraPermission();
                    break;
                case RESULTS.GRANTED:
                    setHasCameraPermission(true);
                    break;
                case RESULTS.BLOCKED:
                    setErrorMessage(translate('摄像头被拒绝访问'));
                    break;
            }
        };
        const requestCameraPermission = async () => {
            const result = await requestPermission(cameraPermission);
            if (result === RESULTS.GRANTED) {
                setHasCameraPermission(true);
            } else if (result === RESULTS.BLOCKED) {
                setErrorMessage(translate('摄像头被拒绝访问'));
            } else {
                setErrorMessage(translate('拒绝使用摄像头'));
            }
        };

        checkAndRequestPermission();
    }, [cameraPermission]);

    const codeScannerIos = isIos && useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes) => {
            const value = codes[0]?.value;
            scanChange(value)
        },
    }) || false

    const scanChange = (value) => {
        if (value && qrCodeDate == '') {
            setQrCodeDate(value)
            if (ApiPort.UserLogin) {
                //已登录需要提示
                setValidCodeModal(true)
            } else {
                loginVerify(value)
            }

        }
    }
    const loginVerify = (data = '') => {
        const value = data || qrCodeDate
        window.NevisLoginVerify(value, (res = {}) => {
            if (res.isSuccess) {
                window.navigateToSceneGlobe()
            } else {
                //验证失败
                setQrCodeDate('')
                setQrcodeInvalid(true)
            }
        })
    }
    const imageLibrary = () => {
        launchImageLibrary({
            mediaType: isIos ? 'photo' : 'mixed',
            includeBase64: true
        }, res => {
            if (res.didCancel) {
                setQrcodeInvalid(true)
                return
            }
            let assets = res.assets || []
            if (assets.length > 0) {
                let fileBytes = assets[0].base64 || ''
                setBase64Image(fileBytes)
            }
        })
    }

    if (!hasCameraPermission) {
        return <View style={styles.container}>
            <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
    }

    return (
        <View style={styles.container}>
            <Modals
                modalVisible={QrcodeInvalid}
                onlyOkBtn={true}
                title={translate('二维码无效')}
                msg={translate('此二维码无效或已失效。请刷新竞博网页上的二维码并重新扫描。')}
                confirm={translate('确认')}
                onConfirm={() => {
                    setQrcodeInvalid(false)
                    setQrCodeDate('')
                }}
            />
            <Modals
                modalVisible={validCodeModal}
                title={translate('检测到重复登录')}
                msg={translate('您已在竞博 APP 上登录，是否确认要登录竞博网页？竞博 APP 将会自动登出。')}
                cancel={'取消'}
                onCancel={() => { Actions.pop() }}
                confirm={'确认'}
                onConfirm={() => { loginVerify() }}
            />
            <Text style={styles.cameraText}>{translate('请扫描竞博网页上所显示的二维码')}</Text>
            {
                isIos ? <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    codeScanner={codeScannerIos}
                    isActive={true}
                />
                    : <RNCamera
                        style={{ flex: 1, width: '95%' }}
                        onBarCodeRead={(res) => { scanChange(res?.data || '') }}
                    />
            }
            <Touch onPress={() => { imageLibrary() }} style={styles.photoView}>
                <Image
                    resizeMode="stretch"
                    source={ImgIcon['photoAlbum']}
                    style={styles.photo}
                />
                <Text style={styles.photoItem}>{translate('相簿')}</Text>
            </Touch>
            {
                !!base64Image &&
                <View style={{width: 2, height: 2}}>
                    <WebView
                        key={Math.random()}
                        style={{width: 2, height: 2}}
                        ref={() => {}}
                        originWhitelist={['*']}
                        source={{ html: ReadImageQrCode(base64Image) }}
                        onMessage={(event) => {
                            event.persist && event.persist();
                            const qrCodeData= event?.nativeEvent?.data || ''
                            setBase64Image('')
                            if(qrCodeData.includes('error_found')) {
                                //图片不是二维码
                                alert(translate('没有找到二维码'))
                            } else if(qrCodeData.includes('error_qr')) {
                                //无法读取二维码
                                setQrcodeInvalid(true)
                            } else {
                                //读取相册二维码成功
                                scanChange(qrCodeData)
                            }
                        }}
                    />
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: '#000',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    photoItem: {
        paddingTop: 10,
        color: '#ccc',
        textAlign: 'center',
    },
    photo: {
        width: 42,
        height: 42,
        marginTop: 25,
    },
    cameraText: {
        color: '#fff',
        paddingBottom: 40,
        paddingTop: 100,
        textAlign: 'center',
    },
    photoView: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraView: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 250
    },
    errorText: {
        color: 'white',
        fontSize: 18,
    },
});

export default ReadQrCodeScreen;
