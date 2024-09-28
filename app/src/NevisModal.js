import React from "react";
import { View, Text, Dimensions, Image, Platform, Modal } from "react-native";
import styles from '$NevisStyles/NevisModal'
import translate from '$Nevis/translate'
const { width, height } = Dimensions.get('window')
import { getConfig } from '$Nevis/config'
import Touch from '$Components/Touch';
import { Actions } from 'react-native-router-flux';
import Modals from '$Nevis/src/Modals'
import ImgIcon from '$NevisStyles/imgs/ImgIcon';
import { NevisRemove } from './InitClient'


const homeModalConfig = {
    Face: {

    },
}

class NevisModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            noMoreTimes: false,
            homeSetModal: false,
            nevisConfigurations: {},
            isEnabled: false,
            checkBox: false,
            otherPhoneSet: false,
            otherNameSet: false,
            homeModeType: '',
            homeModeAaid: '',
            uninstall: false,
            faceEnabled: false,
            fingerprintEnabled: false,
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    //未设置无密码登录，call这只api，有authenticatorId表示已经设置过,这个手机不能再设置
    getMemberAuthenticators = (isHome) => {
        const { isNevisEnabled } = this.props.nevisConfigurations
        const { get } = getConfig()
        if (!ApiPort.UserLogin) { return }
        window.AuthenticatorId = ''
        get(ApiLink.MemberAuthenticators + 'username=' + window.userNameDB + '&')
            .then((res) => {
                const otherPhoneSetId = res?.result?.authenticators[0]?.authenticatorId || false
                const isUninstall = this.isUninstall()
                if (res?.isSuccess && otherPhoneSetId) {
                    window.AuthenticatorId = otherPhoneSetId
                    if(isUninstall) {
                        NevisRemove()
                    }
                } else {
                    if(isUninstall) {
                        NevisRemove()
                        return
                    }
                    //没有设置过，提醒可以去设置
                    if (isNevisEnabled && !this.state.homeModeType && isHome) {
                        global.storage.load({
                            key: 'NevisToSetting',
                            id: 'NevisToSetting'
                        }).then(res => { 

                        }).catch(err => {
                            if(!window.NevisModeType) {
                                const { mode, aaid } = window.NevisAllModeType[0]
                                this.setState({ homeSetModal: true, homeModeType: mode, homeModeAaid: aaid })
                            }
                        })
                    }
                }
            })
            .catch((error) => {

            })
    }
    //是否卸载过
    isUninstall = () => {
        //手机设置了nevis，并且本地没缓存，应该是卸载重新安装用户，要删除nevis重新设置
        const uninstall = !window.NevisModeType && window.NevisUserName || false
        return uninstall
    }

    homeSetModal = (confirm = false) => {
        const homeModeAaid = this.state.homeModeAaid
        const homeModeType = this.state.homeModeType
        this.setState({ homeSetModal: false, homeModeAaid: '', homeModeType: '' }, () => {
            if (confirm) {
                Actions.NevisSetting({ homeModeType, homeModeAaid })
            }
        })
        if (this.state.checkBox) {
            const { nevisSetupReminderDays = 7 } = this.props.nevisConfigurations || {}
            global.storage.save({
                key: 'NevisToSetting',
                id: 'NevisToSetting',
                data: '7天内不提醒',
                expires: nevisSetupReminderDays * 24 * 60 * 60 * 1000
            });
        }
    }
    render() {
        const {
            noMoreTimes,
            otherPhoneSet,
            otherNameSet,
            homeSetModal,
            checkBox,
            homeModeType,
            isEnabled,
            uninstall,
            faceEnabled,
            fingerprintEnabled,
        } = this.state

        let uninstallMode = ''

        const { nevisSetupReminderDays = 7, isNevisEnabled = false } = this.props.nevisConfigurations || {}

        window.onModal = (key, status, data = {}, callback = () => { }) => {
            this.setState({ [key]: status })
            if(key == 'uninstall') {
                uninstallMode = data.mode || ''
            }
        }

        window.AccountSetModal = () => {
            //本机其他账户已经设置了
            const isOtherName = window.NevisUsername && window.NevisUsername != window.userNameDB
            //这个账户在其他手机上设置过了
            const isOtherPhone = window.AuthenticatorId && !window.NevisModeType
            if (isOtherPhone) {
                //这个账户在其他手机上设置过了
                this.setState({ otherPhoneSet: true })
            } else if(isOtherName) {
                //本机其他账户已经设置了
                this.setState({otherNameSet: true})
            } else if(isNevisEnabled) {
                //计入nevis设置
                Actions.NevisSetting()
            } else {
                //未开启nevis
                this.setState({isEnabled: true})
            }
        }
        //获取设置信息
        window.NevisAuthenticators = (isHome = false) => {
            this.getMemberAuthenticators(isHome)
        }


        return (
            <>
                <Modals
                    modalVisible={uninstall}
                    onlyOkBtn={true}
                    title={translate('请重新设置')}
                    msg={
                        translate('{X}已失效，请重新设置', {X: uninstallMode == 'Face'?translate('人脸识别'): uninstallMode == 'Pin'? translate('PIN 码识别'): translate('指纹识别')})
                    }
                    confirm={translate('我知道了')}
                    onConfirm={() => { this.setState({ uninstall: false }) }}
                />
                <Modals
                    modalVisible={noMoreTimes}
                    onlyOkBtn={true}
                    title={translate('已达验证次数上限')}
                    msg={translate(ApiPort.UserLogin?'验证失败次数已达上限，请稍后再尝试或使用其他验证方式。': '验证失败次数已达上限，请使用账号与密码进行登录。')}
                    confirm={translate('我知道了')}
                    onConfirm={() => { this.setState({ noMoreTimes: false }, () => {Actions.pop()}) }}
                />
                <Modals
                    modalVisible={isEnabled}
                    onlyOkBtn={true}
                    title={translate('安全设置')}
                    msg={translate('即将启用，请耐心等待')}
                    confirm={translate('我知道了')}
                    onConfirm={() => { this.setState({ isEnabled: false }) }}
                />
                <Modals
                    modalVisible={faceEnabled}
                    onlyOkBtn={true}
                    title={translate('尚未开通人脸识别权限')}
                    msg={translate('请先开通此装置的人脸识别权限')}
                    confirm={translate('我知道了')}
                    onConfirm={() => { this.setState({ faceEnabled: false }) }}
                />
                <Modals
                    modalVisible={fingerprintEnabled}
                    onlyOkBtn={true}
                    title={translate('尚未开通指纹识别权限')}
                    msg={translate('请先开通此装置的指纹识别权限')}
                    confirm={translate('我知道了')}
                    onConfirm={() => { this.setState({ fingerprintEnabled: false }) }}
                />
                <Modals
                    modalVisible={otherPhoneSet}
                    title={translate('检测到重复设置')}
                    msg={translate('一个账号仅能在一个装置上启用验证方式。若您在此装置启用验证方式，原装置中的相关数据将会被删除。是否要前往启用？')}
                    cancel={'取消'}
                    onCancel={() => { this.setState({ otherPhoneSet: false }) }}
                    confirm={'确认'}
                    onConfirm={() => { this.setState({ otherPhoneSet: false }, () => {
                        NevisRemove()
                        Actions.NevisSetting()
                    }) }}
                />
                <Modals
                    modalVisible={otherNameSet}
                    title={translate('检测到重复设置')}
                    msg={translate('一个装置仅能启用一个账号。若此账号需要启用验证方式，请切换账号删除已添加的验证方式。')}
                    cancel={'取消'}
                    onCancel={() => { this.setState({ otherNameSet: false }) }}
                    confirm={'确认'}
                    onConfirm={() => { this.setState({ otherNameSet: false }, () => {
                        NevisRemove()
                        Actions.NevisSetting({ enableUse: true })
                    }) }}
                />
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={homeSetModal}
                >
                    <View style={styles.models}>
                        <View style={[styles.modalActive]}>
                            <View style={[styles.modalCenter]}>
                                <View style={styles.title}>
                                    <Text style={[styles.modalTitle]}>{translate('免密登录全新上线！')}</Text>
                                </View>

                                <View>
                                    <Image
                                        resizeMode="stretch"
                                        source={
                                            homeModeType == 'Face' ?
                                                ImgIcon['userIcon'] :
                                                homeModeType == 'Fingerprint' ?
                                                    ImgIcon['fingerPrintIcon'] :
                                                    ImgIcon['usrPinIcon']
                                        }
                                        style={{ width: 60, height: 60, marginTop: 20 }}
                                    />
                                </View>

                                {
                                    homeModeType == 'Face' ?
                                        <Text style={[styles.modalMsg]}>{translate('在“我的”页面中完成人脸识别设置，以提升账号验证的便捷性与安全性。')}</Text> :
                                        homeModeType == 'Fingerprint' ?
                                            <Text style={[styles.modalMsg]}>{translate('在“我的”页面中完成指纹识别设置，以提升账号验证的便捷性与安全性。')}</Text> :
                                            <Text style={[styles.modalMsg]}>{translate('在“我的”页面中完成 PIN 码识别设置，以提升账号验证的便捷性与安全性。')}</Text>
                                }

                                <View style={{ marginBottom: 25, marginLeft: -100 }}>
                                     
                                </View>

                                <View style={styles.btnList}>
                                    <Touch
                                        style={styles.btnBorder}
                                        onPress={() => { this.homeSetModal() }}
                                    >
                                        <Text style={styles.btnBorderItem}>{translate('稍后再说')}</Text>
                                    </Touch>
                                    <Touch
                                        style={[styles.btnBg]}
                                        onPress={() => { this.homeSetModal(true) }}
                                    >
                                        <Text style={[styles.btnBgItem]}>{translate('前往设定')}</Text>
                                    </Touch>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}



export default NevisModal
