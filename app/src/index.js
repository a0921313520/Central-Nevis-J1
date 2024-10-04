import React from "react";
import { View, Text, Image, Platform } from "react-native";
import Touch from 'react-native-touch-once';
import { ApiLink } from './Api'
import styles from '$NevisStyles/main'
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import translate from '$Nevis/translate'
import NevisModal from './NevisModal'
import { getConfig } from '$Nevis/config'
import InitClient, { PhoneSensorAvailable } from './InitClient'
import { Actions } from "react-native-router-flux";

window.NevisModeType = ''//已设置mode，setting那边使用, Face/Pin/Fingerprint
window.NevisModeChange = ''//选中的mode, Face/Pin/Fingerprint
window.NevisAllModeType = []
window.ActivePin = false//防止重复进入PIN
window.ApiLink = ApiLink
window.NevisUsername = ''//nevis缓存姓名
window.NToast = ''
window.AuthenticatorId = []//已设置的id，可能出现多个，删除时候要一起删除，不然无法再创建
window.NevisRegistrationUserName = ''//已设置的nevis参数userName
window.SensorAvailable = true//指纹/face是否开启
class Nevis extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            authenticators: {},
            modeType: '',//Face/Pin/Fingerprint
            nevisConfigurations: {},
            accessToken: '',
            refreshToken: '',
            skynetUpdate: '',
            isTokenValid: false,
            tokenStatus: '',
            tokenCreatedAt: '',
            tokenUpdatedAt: '',
            qrCode: {},
            appLink: '',
            statusToken: '',

        }
        this.config = getConfig()
        window.NToast = this.config.NevisToast
        window.JBOVersion = '1.0.3.2'
    }

    componentDidMount() {
        this.getNevisConfigurations()
        PhoneSensorAvailable()
    }

    componentWillUnmount() {

    }
    //是否开启无密码登录。以及设置提示时间
    getNevisConfigurations = () => {
        window.NevisInitClient()
        const { get } = getConfig()
        get(ApiLink.NevisConfigurations)
            .then((res) => {
                if (res?.isSuccess && res?.result?.isNevisEnabled) {
                    this.setState({
                        nevisConfigurations: res.result
                    })
                }
            })
            .catch((error) => { })
    }


    render() {

        const { } = this.props
        const {
            authenticators,
            modeType,
            nevisConfigurations,
        } = this.state

        return (
            <View style={styles.nevis}>
                <InitClient />

                <NevisModal nevisConfigurations={nevisConfigurations} />
            </View>
        )
    }
}



export default Nevis
