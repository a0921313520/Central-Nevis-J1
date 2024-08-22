import React from "react";
import { View, Text, Image } from "react-native";
import Touch from 'react-native-touch-once';
import { ApiLink } from './Api'
import styles from '$NevisStyles/main'
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import translate from '$Nevis/translate'
import NevisModal from './NevisModal'
import { getConfig } from '$Nevis/config'
import { Actions } from "react-native-router-flux";

const fake = {
    "isSuccess": false,
    "errors": [
      {
        "errorCode": "VAL99999",
        "description": "Unknown Error",
        "message": "非常抱歉，目前系统无法处理您的请求，请您稍后再试或联系在线客服为您处理"
      }
    ]
}

const successfake = {
    "isSuccess": true,
    "result": {
      "authenticators": [
        {
          "authenticatorId": "4aa572dc-0a7b-4b72-b7f3-2c1c50b0a707",
          "authenticatorType": "android",
          "authenticatorName": "OPPO CPH2521 12 Jul 2024 10:59:45",
          "authenticatorStatus": "active",
          "enrolledAt" : "2024-07-15T14:48:47Z",
          "updatedAt" : "2024-07-15T14:48:47Z"
        },
      ],   
      "memberCode": "paymentvnd"    
    }
}

const fakelimit = {
    "result": {
      "isNevisEnabled": true,
      "nevisSetupReminderDays": 7,
      "faceIdSetupUpperLimit": 5,
      "faceIdLoginUpperLimit": 5,
      "fingerPrintSetupUpperLimit": 5,
      "fingerPrintLoginUpperLimit": 0,
      "pinCodeLoginUpperLimit": 5
    },
    "isSuccess": true
  }

window.WinModeType = ''//以设置mode，setting那边使用
window.scanIconValue = undefined;  // 定义全局变量
class Nevis extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            authenticators: {},
            modeType: '',//Face/Pin/Fingerprint
            NevisConfigurations: {}
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
        const { get } = getConfig()
        //let res = fakelimit
        get(ApiLink.NevisConfigurations)
            .then((res) => {
            //.then((fakedata) => {
                if (res?.isSuccess) {
                    this.setState({
                        NevisConfigurations: res.result
                    })
                }
            })
            .catch((error) => {
                console.error('NevisConfigurations API请求失败:', error);
            })
    }
    //检查当前是否设置无密码登录，如果有设置过，找到modeType='Face/Pin/Fingerprint'
    getModeType = () => {
        window.WinModeType = 'Face'
        //window.WinModeType = key
        // this.setState({
        //     modeType: window.WinModeType
        // })
    }

    //未设置无密码登录，call这只api，有authenticatorId表示已经设置过,这个手机不能再设置
    getMemberAuthenticators = () => {
        const { get } = getConfig()
        // if (!ApiPort.UserLogin) { 
        //     window.scanIconValue = false;  // 未登录时设置全局变量
        //     return;
        // }
        //let res = fake
        get(ApiLink.MemberAuthenticators)
            .then((res) => {
            //.then((fakedata) => {
                if (res?.isSuccess && res?.result) {
                    console.log('设置过=====')//如authenticatorId不同則要彈彈窗;相同或返回[]則不用彈彈窗;
                    this.setState({ authenticators: res.result.authenticators || {} })
                    window.scanIconValue = true;  // 请求成功时更新全局变量
                }else{
                    console.log('没有设置过=====')
                    window.scanIconValue = false;  // 没有设置时更新全局变量
                    //Actions.NevisSetting() //没有设置过
                }
            })
            .catch((error) => {
                console.error('API请求失败:', error);
                Actions.NevisSetting()
                window.scanIconValue = false;  // 请求失败时更新全局变量
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
            NevisConfigurations
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
                    modeType={modeType}
                    NevisConfigurations={NevisConfigurations}
                />
            </View>
        )
    }
}



export default Nevis
