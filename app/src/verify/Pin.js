import React from "react";
import { View, Text, Dimensions, Vibration } from "react-native";
import translate from '$Nevis/translate'
import styles from '$NevisStyles/PinCode'
import VerificationCodeInput from "./VerificationCodeInput";
import { usePinView, usePinCancel } from '../nevis/screens/PinViewModel'
import { Actions } from "react-native-router-flux";
import { NevisErrs } from '../InitClient'
import Touch from 'react-native-touch-once';


class Pin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            pinCode: '',
            errCode: 0,
            pinMessage: translate("请输入 PIN 码"),
            errTimes: 5,
            oldPin: '',
            isSet: window.PinIsSet || false,
            onSuccess: false,
        }
    }

    componentDidMount() {
        NToast.removeAll()
        window.ActivePin = true
        global.storage.load({
            key: 'NevisOldPin',
            id: 'NevisOldPin'
        }).then(oldPin => {
            //获取之前设置的pin，用于修改pin
            this.setState({oldPin})
        }).catch(err => { })
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.lastRecoverableError != this.props.lastRecoverableError) {
            //Pin错误
            this.verifyErr()
            Vibration.vibrate(300)
        }
    }

    componentWillUnmount() {
        const { mode, handler } = this.props
        setTimeout(() => {
            usePinCancel(mode, handler)
        }, 1000);
        window.PinIsSet = false
        window.ActivePin = false
    }
    refresh = () => {
        const { refresh } = this.state
        setTimeout(() => {
            this.setState({ refresh: !refresh })
        }, 500);
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
        console.log(mode, 'mode, handler', handler)
        if (isSet) {
            //设置pin
            console.log(code, 'pinCode111',pinCode)
            if (pinCode == '') {
                this.setState({ pinCode: code, pinMessage: translate('请确认 PIN 码') });
                this.refresh()
            } else {
                if (code != pinCode) {
                    this.setState({ pinMessage: translate('两次Pin不同') })
                    Vibration.vibrate(300)
                    this.refresh()
                } else {
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
                    !ApiPort.UserLogin &&
                    <Touch onPress={() => { Actions.pop() }}>
                        <Text style={styles.backBtn}>{translate('账号密码登录')}</Text>
                    </Touch>
                }
            </View>
        )
    }
}



export default Pin
