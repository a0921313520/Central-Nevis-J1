import React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import Touch from 'react-native-touch-once';
import { Actions } from "react-native-router-flux";
import styles from '$NevisStyles/Setting'
import { getConfig } from '$Nevis/config'
import translate from '$Nevis/translate'
import { allTypeId, NevisListData } from '../InitClient'
import Pin from './Pin'
import Face from './Face'
import Fingerprint from './Fingerprint'
import SwitchIcon from './SwitchIcon';
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import Modals from '$Nevis/src/Modals'

window.PinIsSet = false//pin设置和验证不同提示语,设置需要输入两次pin
const closeModalText = {
    Face: {
        title: '关闭人脸识别',
        msg: '若您之后要再次开启人脸识别，需要重新设置。是否确定要关闭人脸识别？',
    },
    Fingerprint: {
        title: '关闭指纹识别',
        msg: '若您之后要再次开启指纹识别，需要重新设置。是否确定要关闭指纹识别？',
    },
    Pin: {
        title: '关闭 PIN 码识别',
        msg: '若您之后要再次开启 PIN 码识别，需要重新设置。是否确定要关闭 PIN 码识别？',
    },
}

class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            language: getConfig().language,
            removeModal: '',//已设置，选中要关闭mode
            allModeType: window.NevisAllModeType,//{pin: true, open: false}
            activeOpen: window.NevisModeType,//已开启
            selectMode: '',
            onSuccess: false,
            userName: window.userNameDB || 'userName',
            enableUse: this.props.enableUse || false,
            changModal: false,
            changMode: '',
            selectModeAaid: '',
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
    //api获取appLinkUri，去注册开启nevis
    getEnroll = (isChange = false) => {
        const { get } = getConfig()
        NToast.loading(translate('Loading...'), 200)
        get(ApiLink.GETEnroll)
            .then((res) => {
                NToast.removeAll()
                if (res?.isSuccess && res?.result?.appLinkUri) {
                    window.NevisRegistration(res.result.appLinkUri, (res) => {
                        isChange && this.onChangeRegistration(res)
                        !isChange && this.onRegistration(res)
                    })
                } else {
                    const errMessage = res?.errors[0]?.description || res?.errors[0]?.message
                    NToast.fail(errMessage)
                }
            })
            .catch((error) => {

            })
    }
    //删除后call api
    PUTEnroll = () => {
        const { put } = getConfig()
        put(ApiLink.PUTEnroll + 'authenticatorId=' + window.AuthenticatorId + '&')
            .then((res) => {
                window.NevisAuthenticators()
            })
            .catch((error) => {

            })
    }
    //首次开启
    onRegistration = (res = {}) => {
        const { selectMode } = this.state
        if (res.isSuccess) {
            //开启成功
            window.NevisInitClient()
            window.NevisAuthenticators()
            this.setState({ activeOpen: selectMode, onSuccess: true })
            global.storage.save({
                key: 'NevisUsername',
                id: 'NevisUsername',
                data: this.state.userName,
                expires: null
            });
        } else {
            alert(res.description)
        }
    }
    //更改开启新的，
    onChangeRegistration = (res = {}) => {
        const { changMode} = this.state
        if (res.isSuccess) {
            //开启新的成功，删除旧的
            this.setState({activeOpen: changMode, changMode: ''})
            window.NevisRemoveNevis(() => {
                this.PUTEnroll()
                window.NevisInitClient()
            })
        } else {
            alert(res.description)
        }
    }
    changeMode = (mode = '', aaid) => {
        const { NevisOtp } = getConfig()
        const { activeOpen, enableUse } = this.state
        if (activeOpen == mode) {
            // 已开启，点击后提示关闭
            this.setState({ removeModal: mode })
            mode == 'Pin' && (window.PinIsSet = false)//Pin验证只需要一次输入
        } else if (activeOpen) {
            // 已开启，点击更换
            this.setState({changModal: true, changMode: mode})
            window.NevisSelectAaid = aaid
            mode == 'Pin' && (window.PinIsSet = true)//Pin设置需要两次输入
        } else {
            // 未开启，点击打开
            if(enableUse) { return }//其他手机已绑定设置
            //去验证otp
            NevisOtp()
            this.setState({selectModeAaid: (mode + 'mode__aaid' + aaid)})
            mode == 'Pin' && (window.PinIsSet = true)//Pin设置需要两次输入
        }
    }
    //本地验证,验证成功后才能删除
    removeVerify = () => {
        this.setState({ removeModal: '' })
        window.NevisVerify(this.removeVerifySuccess)
    }
    //删除成功
    removeVerifySuccess = (res = {}) => {
        if(res.isSuccess) {
            window.NevisRemoveNevis(this.removeNevis)
        } else {
            alert(res.description)
        }
    }

    removeNevis = (status = true) => {
        if (status == true) {
            //删除验证成功
            this.setState({ activeOpen: '' })
            window.NevisModeType = ''
            window.NevisInitClient()
            this.PUTEnroll()
        } else {
            alert(translate('关闭失败，请重试'))
        }
    }

    //成功点击返回
    onSuccessBack = () => {
        this.setState({ selectMode: '', onSuccess: false, selectModeAaid: '' })
    }
    //更换验证成功
    changeVerifySuccess = (res = {}) => {
        if(res.isSuccess) {
            //成功后去添加新的，新的添加成功后删除旧的
            this.getEnroll(true)
        } else {
            alert(res.description)
        }
    }
    //更换验证
    changeVerify = () => {
        this.setState({changModal: false}, () => {
            window.NevisVerify(this.changeVerifySuccess)
        })
    }

    render() {
        const {
            removeModal,
            allModeType,
            activeOpen,
            selectMode,
            onSuccess,
            userName,
            language,
            changModal,
            changMode,
            selectModeAaid,
        } = this.state

        window.NevisSetMode = () => {
            const modeAaid = selectModeAaid?.split('mode__aaid')
            this.setState({ selectMode: modeAaid[0] })
            window.NevisSelectAaid = modeAaid[1]
        }

        return (
            <View style={styles.SettingBG}>
                <Modals
                    // 关闭nevis提示
                    modalVisible={!!removeModal}
                    title={closeModalText[removeModal]?.title}
                    msg={closeModalText[removeModal]?.msg}
                    cancel={'取消'}
                    onCancel={() => { this.setState({ removeModal: '' }) }}
                    confirm={'确认'}
                    onConfirm={() => { this.removeVerify() }}
                />
                <Modals
                    // 改nevis提示
                    modalVisible={changModal}
                    title={translate('已启用其他验证方式')}
                    msg={translate('启用{X}将会自动关闭{Y}。若您之后要再次启用{X}，需要重新设置。 是否确定要启用{Y}？', {X: translate(NevisListData[activeOpen]?.name), Y: translate(NevisListData[changMode]?.name)})}
                    cancel={'取消'}
                    onCancel={() => { this.setState({ changModal: false }) }}
                    confirm={'确认'}
                    onConfirm={() => { this.changeVerify() }}
                />

                <Text style={styles.SettingWord}>{translate("启用验证方式")}</Text>
                {
                    allModeType.map((item, index) => {
                        return (
                            <View key={index} style={[styles.switchContainer, { marginTop: 20, }]}>
                                <Image
                                    resizeMode="stretch"
                                    source={NevisListData[item.mode].icon || ImgIcon['faceIcon']}
                                    style={{ width: 30, height: 30 }}
                                />
                                <View style={styles.modeSetting}>
                                    <Text style={styles.SettingFace}>{translate(NevisListData[item.mode].name)}</Text>
                                </View>
                                <SwitchIcon
                                    value={item.mode == activeOpen}
                                    onValueChange={(value) => this.changeMode(item.mode, item.aaid)}
                                />
                            </View>
                        )
                    })
                }
                {
                    selectMode == 'Pin' &&
                    <View style={styles.viewModal}>
                        <Pin
                            getEnroll={this.getEnroll}
                            onSuccess={onSuccess}
                            onSuccessBack={this.onSuccessBack}
                            userName={userName}
                            language={language}
                        />
                    </View>
                }

                {
                    selectMode == 'Face' &&
                    <View style={styles.viewModal}>
                        <Face
                            getEnroll={this.getEnroll}
                            onSuccess={onSuccess}
                            onSuccessBack={this.onSuccessBack}
                            userName={userName}
                            language={language}
                        />
                    </View>
                }

                {
                    selectMode == 'Fingerprint' &&
                    <View style={styles.viewModal}>
                        <Fingerprint
                            getEnroll={this.getEnroll}
                            onSuccess={onSuccess}
                            onSuccessBack={this.onSuccessBack}
                            userName={userName}
                            language={language}
                        />
                    </View>
                }
            </View>
        )
    }
}

export const UserTerms = () => {
    const language = getConfig().language
    return (
        <>
            {
                language == 'CN' && <View>
                    <Text style={[styles.modalMsg]}>
                        点击“启用”即表示您同意竞博规则与条款<Text style={{ color: '#00E62E' }} onPress={() => { Actions.UserTerms({ TermsType: "user" }) }}>规则与条款</Text>
                    </Text>
                </View>
            }
            {
                language == 'TH' && <View>
                    <Text style={[styles.modalMsg]}>
                    เปิดใช้งานและยอมรับ<Text style={{ color: '#00E62E' }} onPress={() => { Actions.UserTerms({ TermsType: "user" }) }}>ข้อกำหนด</Text>ของ JBO
                    </Text>
                </View>
            }
            {
                language == 'VN' && <View>
                    <Text style={[styles.modalMsg]}>
                        Kích hoạt và chấp nhận các <Text style={{ color: '#00E62E' }} onPress={() => { Actions.UserTerms({ TermsType: "user" }) }}>điều khoản điều kiện</Text> của JBO
                    </Text>
                </View>
            }

        </>
    )
}



export default Setting

