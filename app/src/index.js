import React from "react";
import { View, Text, Image } from "react-native";
import Touch from 'react-native-touch-once';
import { ApiPort } from './Api'
import styles from '$NevisStyles/main'
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import translate from '$Nevis/translate'
import NevisModal from './NevisModal'
import { getConfig } from '$Nevis/config'

window.WinModeType = ''//以设置mode，setting那边使用
class Nevis extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            authenticators: {},
            modeType: '',//Face/Pin/Fingerprint
        }
        this.config = getConfig()
    }

    componentDidMount() {
        this.getNevisConfigurations()
    }

    componentWillUnmount() {

    }
    //是否开启无密码登录。以及设置提示时间
    getNevisConfigurations = () => {
        get(ApiPort.NevisConfigurations)
            .then((res) => {
                if (res?.isSuccess) {

                }
            })
            .catch(() => {

            })
    }
    //检查当前是否设置无密码登录，如果有设置过，找到modeType='Face/Pin/Fingerprint'
    getModeType = () => {
        window.WinModeType = 'Face'
    }

    //未设置无密码登录，call这只api，有authenticatorId表示已经设置过,这个手机不能再设置
    getMemberAuthenticators = () => {
        const { get, isLogin } = getConfig()
        if (!isLogin) { return }
        get(ApiPort.MemberAuthenticators)
            .then((res) => {
                if (res?.isSuccess && res?.result) {
                    this.setState({ authenticators: res.result.authenticators || {} })
                }
            })
            .catch(() => {

            })
    }


    render() {

        window.GetModeType = () => {
            this.getModeType()
        }

        window.GetMemberAuthenticators = () => {
            this.getMemberAuthenticators()
        }

        const { } = this.props
        const {
            authenticators,
            modeType,
        } = this.state

        return (
            <View style={styles.nevis}>
                <Text>{translate('QR code登录。')}</Text>
                <Image
                    resizeMode="stretch"
                    source={ImgIcon['testIcon']}
                    style={{ width: 65, height: 35, top: 3, }}
                />
                <NevisModal
                    authenticators={authenticators}
                />
            </View>
        )
    }
}



export default Nevis
