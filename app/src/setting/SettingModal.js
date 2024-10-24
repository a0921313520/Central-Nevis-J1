import React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import Touch from 'react-native-touch-once';
import { Actions } from "react-native-router-flux";
import styles from '$NevisStyles/Setting'
import { getConfig } from '$Nevis/config'
import translate from '$Nevis/translate'
import { allTypeId, NevisListData, SetNevisSuccess, NevisErrs } from '../InitClient'
import Pin from './Pin'
import Face from './Face'
import Fingerprint from './Fingerprint'
import SwitchIcon from './SwitchIcon';
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import Modals from '$Nevis/src/Modals'

class SettingModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: window.userNameDB || 'userName',
            language: getConfig().language,
            onSuccess: false,
        }
    }

    componentDidMount() {
        const { selectMode } = this.props
         //vn改title方式不同
         const title = selectMode == 'Face'? translate('人脸识别'): selectMode == 'Pin'? translate('PIN 码识别'): translate('指纹识别')
         this.props.navigation?.setParams && this.props.navigation.setParams({
             title: this.state.language == 'VN'? title: ''
         })
    }

    componentWillUnmount() {

    }

    render() {
        const {
            userName,
            language,
            onSuccess,
        } = this.state

        const { getEnroll, onSuccessBack, selectMode } = this.props
        window.NevisSetSuccess = () => {
            this.setState({onSuccess: true})
        }
        return (
            <View style={styles.SettingBG}>
                {
                    selectMode == 'Pin' &&
                    <View style={styles.viewModal}>
                        <Pin
                            getEnroll={getEnroll}
                            onSuccess={onSuccess}
                            onSuccessBack={onSuccessBack}
                            userName={userName}
                            language={language}
                        />
                    </View>
                }

                {
                    selectMode == 'Face' &&
                    <View style={styles.viewModal}>
                        <Face
                            getEnroll={getEnroll}
                            onSuccess={onSuccess}
                            onSuccessBack={onSuccessBack}
                            userName={userName}
                            language={language}
                        />
                    </View>
                }

                {
                    selectMode == 'Fingerprint' &&
                    <View style={styles.viewModal}>
                        <Fingerprint
                            getEnroll={getEnroll}
                            onSuccess={onSuccess}
                            onSuccessBack={onSuccessBack}
                            userName={userName}
                            language={language}
                        />
                    </View>
                }
            </View>
        )
    }
}



export default SettingModal

