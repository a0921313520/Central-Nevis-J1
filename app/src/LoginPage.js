import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, Platform, ImageBackground } from "react-native";
import styles from '$NevisStyles/LoginPage'
import translate from '$Nevis/translate'
import Touch from 'react-native-touch-once';
import Verify from './verify/index';
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import { ApiLink } from './Api'
import { Actions } from 'react-native-router-flux';
import { WingBlank } from '@ant-design/react-native';

const {
    width, height
} = Dimensions.get('window')

//新登录page

class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openVerify: this.props.openVerify || false,//跳转进入是否直接打开验证
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    openVerify = () => {
        window.loginFaceSetting()
        this.setState({openVerify: true})
    }

    //拿客服链接
	getLiveChatX() {
        const { get } = getConfig()
        get(ApiLink.LiveChat)
			.then(data => {
				console.log(data, '111')
				if(data){
					Actions.LiveChatST({
						LiveChaturl: data.url,
					})
				}
			})
			.catch((err) => { 
				console.log('err',err)
				if (err.status && err.status === 503) {
					return
				}
			 });
	}

    render() {

        const { modeType, onSuccess, onError, userName } = this.props

        const { openVerify } = this.state 

        return (
            <View style={{ flex: 1 }}>
                <ImageBackground
                    resizeMode="cover"
                    source={ImgIcon['newBG']}
                    style={{ width: width, height: height, flex: 1 }}
                >
                <View style={[{ height: Platform.OS === 'ios' ? 75 : 45, zIndex: 200 }, styles.headerTop]}>
                    <TouchableOpacity 
                        onPress={() => {

                        }}
                        style={{ width: 30 }}
                    >
                        <Image
							resizeMode="stretch"
							source={ImgIcon['scanIcon']}
							style={{ width: 27, height: 24, top: 3, }}
						/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { this.getLiveChatX() }} >
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
                        paddingTop:  Platform.OS === "android" ? 80 : 80,
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
                    <Text onPress={() => { Actions.login({ userName: userName }) }} style={{ color: '#00E62E', fontSize: 14, fontWeight: '400', lineHeight: 35 }}>{translate('切换账号')}</Text>
                </View>

                <WingBlank>

                {
                    <TouchableOpacity onPress={() => { this.openVerify() }}>
                        <View style={styles.Loginsuccess}>
                            <Image
                                resizeMode="stretch"
                                source={ImgIcon['LoginFace']}
                                // source={ImgIcon['LoginFinger']}
                                // source={ImgIcon['LoginPin']}
                                style={{ width: 27, height: 24, marginRight: 10 }}
                            />
                            <Text style={{ color: '#F5F5F5', fontSize: 17 }}>
                                {translate('人脸识别登录')}
                                {/* {translate('指纹识别登录')}
                                {translate('PIN 码登录')} */}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
                {
                   
                    <TouchableOpacity onPress={() => { Actions.login() }}>
                        <View style={styles.Tologin}>
                            <Text style={{ color: '#00E62E', fontSize: 17 }}>
                            {translate('账号密码登录')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }

                </WingBlank>

                <View style={{ paddingTop: 25, justifyContent:'center', alignItems:'center' }}>
                    <Text style={{ color: '#999999', fontSize:14, }}>Chưa có tài khoản?&nbsp;
                        <Text style={{ color:'#00E62E',fontSize:14, }} onPress={() => {Actions.Registered()}}>Đăng ký ngay!</Text>
                    </Text>
                </View> 


                <TouchableOpacity style={styles.guestViewMode} onPress={() => { Actions.home() }}>
                    <Text style={styles.guestText}>{translate('去逛逛')}</Text>
                </TouchableOpacity> 


                
                {/* <Touch onPress={() => {this.openVerify()}}>
                    <Text>立即验证</Text>
                </Touch> */}
                {
                    modeType != '' && openVerify &&
                    <Verify
                        modeType={modeType}
                        onSuccess={() => { }}//验证/添加成功
                        onError={() => { }}//验证/添加失败
                    />
                }
                </ImageBackground>
            </View>
        )
    }
}



export default LoginPage
