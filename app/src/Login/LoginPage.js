import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, Platform, ImageBackground } from "react-native";
import styles from '$NevisStyles/LoginPage'
import translate from '$Nevis/translate'
import Touch from 'react-native-touch-once';
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import { Actions } from 'react-native-router-flux';
import { ScanQRCode } from './LoginComponent'
import { getConfig } from '$Nevis/config'
import { NevisListData, NevisErrs } from '../InitClient'

const {
    width, height
} = Dimensions.get('window')

//新登录page

class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modeType: window.NevisModeType,//无密码登录方式
            statusToken: '',//用于登录
            userName: window.NevisUsername || 'userName',
        }
        this.config = getConfig()
        window.common_url = this.config.common_url || ''
        window.siteId = this.config.SiteId || ''
    }

    componentDidMount() {
        if (this.props.login) {
            //马上call登录
            this.getInitLoginSession()
        }
    }

    componentWillUnmount() {

    }
    //获取appLink，去验证，通过后call VerifyLoginSession登录
    getInitLoginSession = () => {
        const { get } = getConfig()
        NToast.loading(translate('加载中...'), 200)
        get(ApiLink.GETInitLoginSession)
            .then((res) => {
                const appLink = res?.result?.appLink
                const dispatchToken = appLink && appLink.split('dispatchTokenResponse=')[1] || ''
                if (res?.isSuccess && dispatchToken) {
                    window.PinCodeTitle = translate('PIN 码')
                    window.NevisLoginVerify(dispatchToken, this.loginVerify, window.NevisModeType)
                    this.setState({
                        statusToken: res?.result?.statusToken,
                    })
                } else {
                    NToast.removeAll()
                    const errMessage = res?.errors[0]?.description || res?.errors[0]?.message
                    NToast.fail(errMessage)
                }
            })
            .catch((error) => {

            })
    }
    loginVerify = (res = {}) => {
        if (res.isSuccess) {
            //验证成功，call 登录api
            this.postVerifyLoginSession()
        } else {
            //验证失败
            NevisErrs(res, window.NevisModeType)
        }
    }
    postVerifyLoginSession = () => {
        const { post, HomePage } = getConfig()
        const { userName } = this.state
        NToast.loading(translate('加载中...'), 200)
        post(
            ApiLink.POSTVerifyLoginSession + 
            'statusToken=' + this.state.statusToken + 
            '&hostName=' + window.common_url + 
            '&siteId=' + window.siteId +
            '&'
        )
        .then((res) => {
            NToast.removeAll()
            const result = res?.result
            if (res?.isSuccess && result) {
                const { accessToken, tokenType, refreshToken } = result
                ApiPort.Token = tokenType + ' ' + accessToken
                ApiPort.LogoutTokey = refreshToken
                ApiPort.access_token = accessToken
                ApiPort.UserLogin = true
                window.userNameDB = userName
                window.LoginRefresh()
                HomePage()
            } else {
                const errMessage = res?.errors[0]?.description || res?.errors[0]?.message
                NToast.fail(errMessage)
            }
        })
        .catch((error) => {

        })
    }
    getMember = () => {

    }



    render() {
        const { LiveChat, HomePage, Registered } = getConfig()
        const { userName, modeType } = this.state

        return (
            <View style={{ flex: 1 }}>
                <ImageBackground
                    resizeMode="cover"
                    source={ImgIcon['newBG']}
                    style={{ width: width, height: height, flex: 1 }}
                >
                    <View style={[styles.headerTop, {paddingTop: DeviceInfoIos? 55: 25}]}>
                        <TouchableOpacity
                            onPress={() => { ScanQRCode() }}
                            style={{ width: 30 }}
                        >
                            <Image
                                resizeMode="stretch"
                                source={ImgIcon['scanIcon']}
                                style={{ width: 27, height: 24, top: 3, }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { LiveChat() }} >
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ left: 2 }}>
                                    <Image
                                        resizeMode="stretch"
                                        source={ImgIcon['csIcon']}
                                        style={{ width: 28, height: 28, marginRight: 10 }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={[
                        styles.logo,
                        {
                            paddingTop: 15,
                        }
                    ]}
                    >
                        <Image
                            resizeMode='stretch'
                            source={ImgIcon['newWelcome']}
                            style={styles.iconImage}
                        />
                    </View>


                    <View style={styles.contentStyle}>
                        <Text style={styles.contentHeadText}>{translate("欢迎回来")}</Text>
                        <Text style={styles.contentNameText}>{userName}</Text>
                        <Text onPress={() => {
                            Actions.pop()
                            window.UserNameChange && window.UserNameChange()
                        }} style={styles.contentAccChange}>{translate('切换账号')}</Text>
                    </View>


                    <TouchableOpacity onPress={() => { this.getInitLoginSession() }}>
                        <View style={styles.Loginsuccess}>
                            <Image
                                resizeMode="stretch"
                                source={NevisListData[modeType].icon}
                                style={{ width: 27, height: 24, marginRight: 10 }}
                            />
                            <Text style={styles.loginName}>
                                {translate(NevisListData[modeType].name)}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => {
                            Actions.pop()
                            window.UserNameChange && window.UserNameChange({userName: userName})
                        }}
                    >
                        <View style={styles.Tologin}>
                            <Text style={styles.normalLogin}>
                                {translate('账号密码登录')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ paddingTop: 25, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.noAcc}>{translate('没有账号?')}
                            <Text style={styles.goRegister} onPress={() => { Registered() }}>{translate('立即注册')}</Text>
                        </Text>
                    </View>


                    <TouchableOpacity style={styles.guestViewMode} onPress={() => { HomePage() }}>
                        <Text style={styles.guestText}>{translate('去逛逛')}</Text>
                    </TouchableOpacity>



                </ImageBackground>
            </View>
        )
    }
}



export default LoginPage
