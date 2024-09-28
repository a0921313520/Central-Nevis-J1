import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, Platform, ImageBackground } from "react-native";
import styles from '$NevisStyles/LoginPage'
import translate from '$Nevis/translate'
import Touch from '$Components/Touch';
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
        NToast.loading(translate('Loading...'), 200)
        get(ApiLink.GETInitLoginSession)
            .then((res) => {
                NToast.removeAll()
                const appLink = res?.result?.appLink
                const dispatchToken = appLink && appLink.split('dispatchTokenResponse=')[1] || ''
                if (res?.isSuccess && dispatchToken) {
                    window.NevisLoginVerify(dispatchToken, this.loginVerify)
                    this.setState({
                        statusToken: res?.result?.statusToken,
                    })
                } else {
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
        const { post } = getConfig()
        const { userName } = this.state
        NToast.loading(translate('Loading...'), 200)
        post(ApiLink.POSTVerifyLoginSession + 'statusToken=' + this.state.statusToken + '&')
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
                    <View style={[styles.headerTop]}>
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
                            paddingTop: Platform.OS === "android" ? 80 : 80,
                            top:
                                Platform.OS === "android"
                                    ? -50
                                    : 20
                        }
                    ]}
                    >
                        <Image
                            resizeMode='stretch'
                            source={ImgIcon['newWelcome']}
                            style={{
                                width: Platform.OS == "android" ? width / 3.3 : width / 2,
                                height: height / 10
                            }}
                        />
                    </View>

                    <View style={{ flex: 0.2 }}></View>

                    <View style={styles.contentStyle}>
                        <Text style={{ color: '#CCCCCC', fontSize: 16, fontWeight: '400', lineHeight: 40 }}>{translate("欢迎回来")}</Text>
                        <Text style={{ color: '#F5F5F5', fontSize: 24, fontWeight: '700', lineHeight: 40 }}>{userName}</Text>
                        <Text onPress={() => {
                            Actions.pop()
                            window.UserNameChange && window.UserNameChange()
                        }} style={{ color: '#00E62E', fontSize: 14, fontWeight: '400', lineHeight: 35 }}>{translate('切换账号')}</Text>
                    </View>


                    <TouchableOpacity onPress={() => { this.getInitLoginSession() }}>
                        <View style={styles.Loginsuccess}>
                            <Image
                                resizeMode="stretch"
                                source={NevisListData[modeType].icon}
                                style={{ width: 27, height: 24, marginRight: 10 }}
                            />
                            <Text style={{ color: '#F5F5F5', fontSize: 17 }}>
                                {translate(NevisListData[modeType].name)}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        Actions.pop()
                        window.UserNameChange && window.UserNameChange({userName: userName})
                    }}>
                        <View style={styles.Tologin}>
                            <Text style={{ color: '#00E62E', fontSize: 17 }}>
                                {translate('账号密码登录')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ paddingTop: 25, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#999999', fontSize: 14, }}>{translate('没有账号?')}
                            <Text style={{ color: '#00E62E', fontSize: 14, }} onPress={() => { Registered() }}>{translate('立即注册')}</Text>
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
