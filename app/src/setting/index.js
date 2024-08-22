import React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import Touch from 'react-native-touch-once';
import { Actions } from "react-native-router-flux";
import styles from '$NevisStyles/main'
import translate from '$Nevis/translate'
import Face from './Face'
import SwitchIcon from './SwitchIcon';
import ImgIcon from '$NevisStyles/imgs/ImgIcon'


class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            setMode: window.WinModeType || '',//已设置的mode
            scanIconValue: window.scanIconValue || undefined,
            openMode: '',//未设置，打开哪个mode设置
            closeMode: '',//已设置，选中要关闭mode
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    //打开一个开始设置
    openMode = (key = '') => {
        this.setState({ openMode: key })
        // window.GetModeType(key)
        Actions[key]({
             onSuccess: this.onSuccess,
             onError: this.onError,
        })
    }

    closeMode = (key = '') => {
        this.setState({ closeMode: key })

    }

    //设置成功
    onSuccess = (res) => {
        const setMode = this.state.openMode
        this.setState({ setMode, openMode: '' })
        window.GetModeType()
    }
    //设置失败
    onError = (res) => {
        this.setState({ openMode: '' })
    }

    //关闭成功
    onCloseSuccess = () => {
        this.setState({ closeMode: '', setMode: '' })
    }
    //关闭失败
    onCloseError = () => {
        this.setState({ closeMode: '' })
    }

    render() {

        const {
            setMode,
            closeMode,
        } = this.state

        return (
            <View style={styles.SettingBG}>
                <View>
                    <Text style={styles.SettingWord}>{translate("启用验证方式")}</Text>
                </View>
                
                {
                    //都未开启
                    setMode == '' &&
                    <>
                    <View style={[styles.switchContainer,{  marginTop:20, }]}>
                        <Image
                            resizeMode="stretch"
                            source={ImgIcon['faceIcon']}
                            style={{ width: 30, height: 30 }}
                        />
                        <View style={styles.modeSetting}>
                            <Text style={styles.SettingFace}>{translate('人脸识别')}</Text>
                        </View>
                        <SwitchIcon
                            value={this.state.setMode}
                            onValueChange={(value) => this.openMode('Face', value)}
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Image
                            resizeMode="stretch"
                            source={ImgIcon['fingerIcon']}
                            style={{ width: 30, height: 30 }}
                        />
                        <View style={styles.modeSetting}>
                            <Text style={styles.SettingFace}>{translate('指纹识别')}</Text>
                        </View>
                        <SwitchIcon
                            value={this.state.faceRecognition}
                            onValueChange={(value) => this.openMode('Fingerprint', value)}
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Image
                            resizeMode="stretch"
                            source={ImgIcon['pinIcon']}
                            style={{ width: 30, height: 30 }}
                        />
                        <View style={styles.modeSetting}>
                            <Text style={styles.SettingFace}>{translate('PIN 码识别')}</Text>
                        </View>
                        <SwitchIcon
                            value={this.state.faceRecognition}
                            onPress={() => { console.log('switch>>>') }}
                        />
                    </View>
            
                        
                        {/* <Touch onPress={() => { this.openMode('Fingerprint') }}>
                            <Text style={styles.SettingWord}>set Fingerprint</Text>
                        </Touch>
                        <Touch onPress={() => { this.openMode('Pin') }}>
                            <Text style={styles.SettingWord}>set Pin</Text>
                        </Touch> */}
                    </>
                }

                {
                    //已开启Face
                    setMode == 'Face' &&
                    <Touch onPress={() => { this.closeMode('Face') }}>
                        <Text>close Face</Text>
                    </Touch>
                }
                {
                    //已开启Fingerprint
                    setMode == 'Fingerprint' &&
                    <Touch onPress={() => { this.closeMode('Fingerprint') }}>
                        <Text>close Fingerprint</Text>
                    </Touch>
                }
                {
                    //已开启Pin
                    setMode == 'Pin' &&
                    <Touch onPress={() => { this.closeMode('Pin') }}>
                        <Text>close Pin</Text>
                    </Touch>
                }


                {
                    closeMode &&
                    <Verify
                        modeType={closeMode}
                        onSuccess={() => { this.onCloseSuccess() }}//验证/添加成功
                        onError={() => { this.onCloseError() }}//验证/添加失败
                    />
                }
            </View>
        )
    }
}



export default Setting
