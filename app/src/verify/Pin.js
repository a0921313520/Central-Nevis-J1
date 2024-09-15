import React from "react";
import { View, Text, Dimensions } from "react-native";
import translate from '$Nevis/translate'
import styles from '$NevisStyles/PinCode'
import VerificationCodeInput from "./VerificationCodeInput";
import { usePinView, usePinCancel } from '../nevis/screens/PinViewModel'
import { Actions } from "react-native-router-flux";


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
    }

    componentDidMount() {
        
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.lastRecoverableError != this.props.lastRecoverableError) {
            //Pin错误
            this.verifyErr()
        }
    }

    componentWillUnmount() {
        // const { mode, handler } = this.props
        window.ActivePin = true
        // usePinCancel(mode, handler)
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
                    this.refresh()
                } else {
                    usePinView(code, mode, handler)
                    Actions.pop()
                }
            }
        } else {
            //验证pin
            usePinView(code, mode, handler)
            Actions.pop()
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
            </View>
        )
    }
}



export default Pin
