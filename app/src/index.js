import React from "react";
import { View, Text, Image, Platform } from "react-native";
import Touch from 'react-native-touch-once';
import { ApiLink } from './Api'
import styles from '$NevisStyles/main'
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import translate from '$Nevis/translate'
import NevisModal from './NevisModal'
import { getConfig } from '$Nevis/config'
import InitClient from './InitClient'
import { Actions } from "react-native-router-flux";

window.NevisModeType = ''//已设置mode，setting那边使用, Face/Pin/Fingerprint
window.NevisAllModeType = []
window.ActivePin = true//防止重复进入PIN
window.ApiLink = ApiLink
window.NevisSelectAaid = ''//选中要开启的类型, Face/Pin/Fingerprint
window.NevisUsername = ''//nevis缓存姓名
window.NToast = ''
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
    }

    componentDidMount() {
        this.getNevisConfigurations()
        // this.POSTVerifyEnrollToken()
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
                    window.NevisInitClient()
                    this.setState({
                        nevisConfigurations: res.result
                    })
                }
            })
            .catch((error) => { })
    }

    POSTVerifyEnrollToken = () => {
        const { post } = getConfig()
        let data = {
            authenticatorId: '4aa572dc-0a7b-4b72-b7f3-2c1c50b0a707',
            statusToken: '8325fd35-5eeb-43bd-bc9d-68e503932ea0'
        }
        post(ApiLink.POSTVerifyEnrollToken + 'statusToken=' + data.statusToken + '&' + 'authenticatorId=' + data.authenticatorId + '&')
            .then((res) => {
                if (res?.isSuccess) {
                    this.setState({
                        isTokenValid: res.isTokenValid,
                        tokenStatus: res.tokenStatus,
                        tokenCreatedAt: res.tokenCreatedAt,
                        tokenUpdatedAt: res.tokenUpdatedAt,
                    })
                }
            })
            .catch((error) => {
                
            })
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
