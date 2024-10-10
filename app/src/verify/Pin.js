import React from "react";
import { View, Text, Dimensions, Vibration } from "react-native";
import translate from '$Nevis/translate'
import styles from '$NevisStyles/PinCode'
import VerificationCodeInput from "./VerificationCodeInput";
import { usePinView, usePinCancel } from '../nevis/screens/PinViewModel'
import { Actions } from "react-native-router-flux";
import { NevisErrs } from '../InitClient'
import { getConfig } from '$Nevis/config'
import Touch from 'react-native-touch-once';


class Pin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            pinCode: this.props.pinCode || '',
            errCode: 0,
            pinMessage: this.props.pinCode? translate("请确认 PIN 码"): translate("请输入 PIN 码"),
            errTimes: 5,
            oldPin: '',
            isSet: this.props.mode != 'verification' || false,
            onSuccess: false,
        }
        this.isAddSubmit = false//第二次输入是否提交,未提交返回第一次输入
    }

    componentDidMount() {
        NToast.removeAll()
        window.ActivePin = true
        this.navigationTitle()
        global.storage.load({
            key: 'NevisOldPin',
            id: 'NevisOldPin'
        }).then(oldPin => {
            //获取之前设置的pin，用于修改pin
            this.setState({oldPin})
        }).catch(err => { })
    }
    componentDidUpdate(prevProps, prevState) {
        const { mode, lastRecoverableError } = this.props
        if (mode== 'verification' && prevProps.lastRecoverableError != lastRecoverableError) {
            //Pin错误
            this.verifyErr()
            Vibration.vibrate(300)
        }
    }

    componentWillUnmount() {
        window.PinCodeTitle = ''
        const { mode, handler } = this.props
        if(mode == 'verification' || this.state.pinCode === '') {
            setTimeout(() => {
                usePinCancel(mode, handler)
            }, 1000);
            window.ActivePin = false
        }
        if(this.isAddSubmit) {
            Actions.pop()
        }
    }
    navigationTitle = () => {
        this.props.navigation?.setParams && this.props.navigation.setParams({
            title: getConfig().language == 'VN'?  window.PinCodeTitle: ''
        })
    }
    refresh = () => {
        const { refresh } = this.state
        setTimeout(() => {
            this.setState({ refresh: !refresh })
        }, 200);
    }
    verifyErr = () => {
        NToast.removeAll()
        const errTimes = this.state.errTimes - 1
        this.refresh()
        this.setState({
            pinMessage: translate("请输入 PIN 码，您还有 {X} 次尝试机会", { X: errTimes }),
            errTimes,
        })
        if(errTimes <= 0) {
            Actions.pop()
            NevisErrs({errorCode: {type: 'USER_LOCKOUT'}})
        }
    }
    checked(code) {
        const { pinCode, isSet, refresh, oldPin } = this.state
        const { mode, handler, lastRecoverableError, authenticatorProtectionStatus } = this.props
        if (isSet) {
            //设置pin
            if (pinCode == '') {
                this.refresh()
                Actions.PinCode({
                    mode: mode,
                    handler: handler,
                    pinCode: code,
                })
            } else {
                if (code != pinCode) {
                    Vibration.vibrate(300)
                    Actions.pop()
                } else {
                    this.isAddSubmit = true
                    if(oldPin == code && mode == 'credentialChange') {
                        //修改pin，与旧code相同，直接退出，切换成功
                        Actions.pop()
                        window.SetRegistration && window.SetRegistration()
                        return
                    }
                    usePinView(code, mode, handler, oldPin)
                    global.storage.save({
                        key: 'NevisOldPin',
                        id: 'NevisOldPin',
                        data: code,
                        expires: null
                    })
                }
            }
        } else {
            //验证pin
            usePinView(code, mode, handler)
            global.storage.save({
                key: 'NevisOldPin',
                id: 'NevisOldPin',
                data: code,
                expires: null
            })
        }

    }

    render() {
        const { errCode, pinCode, refresh, pinMessage } = this.state;
        return (
            <View style={styles.pinCode}>
                <View style={styles.pinTips}>
                    <Text style={styles.pinTipsItem}>{pinMessage}</Text>
                </View>

                <VerificationCodeInput
                    refresh={refresh}//错误刷新
                    inputSize={6}
                    TextInputChange={(value) => {
                        this.checked(value);
                    }}
                />
                {
                    (!ApiPort.UserLogin || window.PinCodeTitle == translate('账户信息验证')) &&
                    <Touch onPress={() => {
                        Actions.pop()
                        if(ApiPort.UserLogin) {
                            const { NevisOtp } = getConfig()
                            NevisOtp({actionType: 'Unbind'})
                        }
                    }}>
                        <Text style={styles.backBtn}>
                            {
                                !ApiPort.UserLogin? translate('账号密码登录'): translate('手机验证')
                            }
                        </Text>
                    </Touch>
                }
            </View>
        )
    }
}



export default Pin
