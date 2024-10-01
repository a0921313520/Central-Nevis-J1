import React from "react";
import { View, Text, Dimensions, Vibration } from "react-native";
import translate from '$Nevis/translate'
import styles from '$NevisStyles/PinCode'
import VerificationCodeInput from "./VerificationCodeInput";
import { usePinView, usePinCancel } from '../nevis/screens/PinViewModel'
import { Actions } from "react-native-router-flux";
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
            isSet: window.PinIsSet || false,
            onSuccess: false,
        }
        global.storage.load({
            key: 'NevisPinLock',
            id: 'NevisPinLock'
        }).then(res => {
            Actions.pop()
            window.onModal('noMoreTimes', true)
        }).catch(err => { })
    }

    componentDidMount() {
        window.ActivePin = true
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
        const errTimes = this.state.errTimes - 1
        this.refresh()
        this.setState({
            pinMessage: translate("请输入 PIN 码，您还有 {X} 次尝试机会", { X: errTimes }),
            errTimes,
        })
        if(errTimes <= 0) {
            Actions.pop()
            window.onModal('noMoreTimes', true)
            global.storage.save({
                key: 'NevisPinLock',
                id: 'NevisPinLock',
                data: true,
                expires: 5 * 60 * 1000//5分钟
            })
        }
    }
    checked(code) {
        const { pinCode, isSet, refresh } = this.state
        const { mode, handler, lastRecoverableError, authenticatorProtectionStatus } = this.props
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
                    usePinView(code, mode, handler)
                }
            }
        } else {
            //验证pin
            usePinView(code, mode, handler)
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
