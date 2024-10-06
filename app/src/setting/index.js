import React from "react";
import { View, Text, Dimensions, Image, Platform } from "react-native";
import Touch from 'react-native-touch-once';
import { Actions } from "react-native-router-flux";
import styles from '$NevisStyles/Setting'
import { getConfig } from '$Nevis/config'
import translate from '$Nevis/translate'
import { allTypeId, NevisListData, SetNevisSuccess, NevisErrs, NevisRemove } from '../InitClient'
import Pin from './Pin'
import Face from './Face'
import Fingerprint from './Fingerprint'
import SwitchIcon from './SwitchIcon';
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import Modals from '$Nevis/src/Modals'

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
            userName: window.userNameDB || 'userName',
            enableUse: this.props.enableUse || false,
            changModal: false,
            closeVerifyModal: false,
            changeVerifyModal: false,
            otpRemove: false,
        }
    }

    componentDidMount() {
        const { homeModeType, homeModeAaid } = this.props
        const { NevisOtp } = getConfig()
        //home弹窗跳过来直接去设置
        if(homeModeType && homeModeAaid ) {
            this.setState({selectMode: homeModeType}, () => {
                NevisOtp({actionType: 'Enrollment'})
            })
        }
    }

    componentWillUnmount() {
        
    }
    //api获取appLinkUri，去注册开启nevis
    getEnroll = () => {
        const { selectMode } = this.state
        const allActive = window.NevisAllModeType.filter((v) => { return v?.registration?.length > 0 })
        if(allActive.length > 1) {
            //手机已经有两个方法了，不需要call api注册，验证成功后直接切换
            if(selectMode == 'Pin') {
                //pin是更改pin code
                window.NevisChangePin(this.onRegistration)
            } else {
                window.NevisVerify(this.onRegistration, selectMode)
            }
            return
        }
        const { get } = getConfig()
        NToast.loading(translate('Loading...'), 200)
        get(ApiLink.GETEnroll)
            .then((res) => {
                NToast.removeAll()
                if (res?.isSuccess && res?.result?.appLinkUri) {
                    window.NevisRegistration(res.result.appLinkUri, this.onRegistration, selectMode)
                } else {
                    const errMessage = res?.errors[0]?.description || res?.errors[0]?.message
                    NToast.fail(errMessage)
                }
            })
            .catch((error) => {

            })
    }
    //开启成功
    onRegistration = (res = {}) => {
        const { selectMode } = this.state
        const activeOpen = selectMode
        if (res.isSuccess) {
            //开启成功
            window.NevisAuthenticators()
            this.setState({ activeOpen, selectModeAaid: '' })
            SetNevisSuccess()
            window.NevisSetSuccess && window.NevisSetSuccess()
            setTimeout(() => {
                window.NevisInitClient()
            }, 500);
        } else {
            NevisErrs(res, activeOpen)
        }
    }
    changeMode = (mode = '') => {
        const { NevisOtp } = getConfig()
        const { activeOpen, enableUse } = this.state
        if(enableUse) { return }//其他手机已绑定设置

        this.setState({otpRemove: false, selectMode: mode})
        if (activeOpen == mode) {
            // 已开启，点击后提示关闭
            this.setState({ removeModal: mode })
        } else if (activeOpen) {
            // 已开启，点击更换
            if(this.isSensorOff(mode)) { return }
            this.setState({changModal: true})
        } else {
            // 未开启，点击打开
            if(this.isSensorOff(mode)) { return }
            //去验证otp
            NevisOtp({actionType: 'Enrollment'})
            // setTimeout(() => {
            //     window.NevisSetMode()
            // }, 1000);
        }
    }
    //手机中的指纹/face未开启
    isSensorOff = (mode = '') => {
        const isOff = mode != 'Pin' && !window.SensorAvailable
        if(['Fingerprint', 'Face'].includes(mode) && isOff) {
            window.onModal(mode == 'Face'? 'faceEnabled': 'fingerprintEnabled', true)
        }

        return isOff
    }
    //本地验证,验证成功后才能删除
    removeVerify = () => {
        const mode = this.state.removeModal
        this.setState({ removeModal: '' }, () => {
            if(!window.SensorAvailable && mode != 'Pin') {
                this.goOTP("closeVerify")
            } else {
                this.setState({closeVerifyModal: true})
            }
        })
    }
    //删除前验证
    closeVerify = () => {
        this.setState({closeVerifyModal:false}, () => {
            window.NevisVerify(this.removeVerifySuccess, this.state.selectMode)
        })
    }
    //本地验证成功
    removeVerifySuccess = (res = {}) => {
        const mode = this.state.activeOpen
        if(res.isSuccess) {
            NevisRemove(() => {
                this.setState({ activeOpen: '' })
            })
        } else {
            NevisErrs(res, mode)
        }
    }

    //成功点击返回
    onSuccessBack = () => {
        Actions.pop()
    }
    //更换验证成功
    changeVerifySuccess = (res = {}) => {
        if(res.isSuccess) {
            //成功后去添加新的，新的添加成功后删除旧的
            this.getEnroll()
        } else {
            NevisErrs(res, window.NevisModeType)
        }
    }
    //更换验证
    changeVerify = () => {
        this.setState({changModal: false,changeVerifyModal:true})
    }
    //更换验证前的再次簡易验证
    againVerify = () => {
        this.setState({changeVerifyModal:false}, () => {
            window.NevisVerify(this.changeVerifySuccess, window.NevisModeType)
        })
    }
    goOTP = (type) => {
        console.log('type>>>',type)
        const { NevisOtp } = getConfig()
        //去验证otp
        NevisOtp({actionType: 'Unbind'})
        if(type == 'closeVerify') {
            this.setState({otpRemove: true})
        }
    }



    render() {
        const {
            removeModal,
            allModeType,
            activeOpen,
            selectMode,
            userName,
            language,
            changModal,
            otpRemove,
            closeVerifyModal,
            enableUse,
            changeVerifyModal
        } = this.state

        window.SetRegistration = () => {
            this.onRegistration({isSuccess: true})
        }

        window.NevisSetMode = () => {
            if(otpRemove) {
                //otp删除nevis
                NevisRemove(() => {
                    this.setState({ activeOpen: '', otpRemove: false })
                })
                return
            }
            //进入设置，添加或者更改
            Actions.NevisSettingModal({
                selectMode: selectMode,
                getEnroll: this.getEnroll,
                onSuccessBack: this.onSuccessBack,
            })
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
                    msg={translate('启用{X}将会自动关闭{Y}。若您之后要再次启用{X}，需要重新设置。 是否确定要启用{Y}？', {X: translate(NevisListData[activeOpen]?.name), Y: translate(NevisListData[selectMode]?.name)})}
                    cancel={'取消'}
                    onCancel={() => { this.setState({ changModal: false }) }}
                    confirm={'确认'}
                    onConfirm={() => { this.changeVerify() }}
                />
                <Modals
                    // 关闭nevis >>> pwl驗證
                    modalVisible={closeVerifyModal}                    
                    onlyOkBtn={true}
                    againVerify={true}
                    title={translate('账户信息验证')}
                    msg={translate(`为保障您的账户安全，请完成账户信息验证。`)}
                    cancel={'手机验证'}
                    onCancel={() => { this.setState({ closeVerifyModal: false }), this.goOTP("closeVerify") }}
                    onClose={() => this.setState({ closeVerifyModal: false })}
                    confirm={translate(NevisListData[activeOpen]?.name)}//要被解除的
                    onConfirm={() => { this.closeVerify() }}
                    imgIcon={NevisListData[activeOpen]?.icon}
                />
                <Modals
                    // 改nevis >>> pwl驗證
                    modalVisible={changeVerifyModal}
                    onlyOkBtn={true}
                    againVerify={true}
                    title={translate('账户信息验证')}
                    msg={translate(`为保障您的账户安全，请完成账户信息验证。`)}
                    cancel={'手机验证'}
                    onCancel={() => { this.setState({ changeVerifyModal: false }), this.goOTP("changeVerify") }}
                    onClose={() => this.setState({ changeVerifyModal: false })}
                    confirm={translate(NevisListData[activeOpen]?.name)}//要被解除的
                    onConfirm={() => { this.againVerify() }}
                    imgIcon={NevisListData[activeOpen]?.icon}
                />

                <Text style={styles.SettingWord}>{translate("启用验证方式")}</Text>
                {
                    allModeType.map((item, index) => {
                        return (
                            <View key={index} style={[styles.switchContainer, { marginTop: 8, }]}>
                                <Image
                                    resizeMode="stretch"
                                    source={NevisListData[item.mode].icon || ImgIcon['faceIcon']}
                                    style={{ width: 30, height: 30, marginLeft: 10 }}
                                />
                                <View style={styles.modeSetting}>
                                    <Text style={styles.SettingFace}>{translate(NevisListData[item.mode].name)}</Text>
                                </View>
                                <SwitchIcon
                                    value={!enableUse? item.mode == activeOpen: false}
                                    onValueChange={(value) => this.changeMode(item.mode, item.aaid)}
                                />
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}

export const UserTerms = () => {
    const { UserTerms, language } = getConfig()
    return (
        <>
            {
                language == 'CN' && <Touch onPress={() => { ApiPort.UserTerms = "用户规则条款"; UserTerms() }}>
                    <Text style={[styles.modalMsg,{ marginBottom: 10, }]}>
                        点击“启用”即表示您同意竞博规则与条款<Text style={{ color: '#00E62E' }}>规则与条款</Text>
                    </Text>
                </Touch>
            }
            {
                language == 'TH' && <Touch>
                    <Text style={[styles.modalMsg]} onPress={() => { ApiPort.UserTerms = "เงื่อนไขและข้อตกลง"; UserTerms() }}>
                    เปิดใช้งานและยอมรับ<Text style={{ color: '#00E62E' }}>ข้อกำหนด</Text>ของ JBO
                    </Text>
                </Touch>
            }
            {
                language == 'VN' && <Touch>
                    <Text style={[styles.modalMsg]} onPress={() => { UserTerms() }}>
                        Kích hoạt và chấp nhận các <Text style={{ color: '#00E62E' }}>điều khoản điều kiện</Text> của JBO
                    </Text>
                </Touch>
            }

        </>
    )
}



export default Setting

