import React from "react";
import { View, Text, Dimensions, Image, Platform, Modal } from "react-native";
import styles from '$NevisStyles/NevisModal'
import translate from '$Nevis/translate'
const { width, height } = Dimensions.get('window')
import { getConfig } from '$Nevis/config'
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';
import Modals from '$Nevis/src/Modals'
import ImgIcon from '$NevisStyles/imgs/ImgIcon';
import CheckBox from 'react-native-check-box'


const homeModalConfig = {
    Face: {

    },
}

class NevisModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            noMoreTimes: false,
            noLoginMoreTimes: false,
            homeSetModal: false,
            nevisConfigurations: {},
            isEnabled: false,
            checkBox: false,
            repeatSet: false,
            homeModeType: '',
            homeModeAaid: '',
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
                if (res?.isSuccess && otherPhoneSetId) {
                    window.AuthenticatorId = otherPhoneSetId
                } else {
                    //没有设置过，提醒可以去设置
                    if (isNevisEnabled && !this.state.homeModeType && isHome) {
                        global.storage.load({
                            key: 'NevisToSetting',
                            id: 'NevisToSetting'
                        }).then(res => { 

                        }).catch(err => {
                            const { mode, aaid } = window.NevisAllModeType[0]
                            this.setState({ homeSetModal: true, homeModeType: mode, homeModeAaid: aaid  })
                        })
                    }
                }
            })
            .catch((error) => {

            })
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
            noLoginMoreTimes,
            repeatSet,
            homeSetModal,
            checkBox,
            homeModeType,
            isEnabled,
            faceEnabled,
            fingerprintEnabled,
        } = this.state

        const { nevisSetupReminderDays = 7, isNevisEnabled = false } = this.props.nevisConfigurations || {}

        window.onModal = (key, status, data = {}, callback = () => { }) => {
            this.setState({ [key]: status })
        }

        window.AccountSetModal = () => {
            //本机其他账户已经设置了
            const isOtherName = window.NevisUsername && window.NevisUsername != window.userNameDB
            //这个账户在其他手机上设置过了
            const isOtherPhone = window.AuthenticatorId && !window.NevisModeType
            if (isOtherName || isOtherPhone) {
                //重复设置提示,1.登录名和已设置的不同，2.当前手机未设置,其他手机已设置了
                this.setState({ repeatSet: true })
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
                    modalVisible={noLoginMoreTimes}
                    onlyOkBtn={true}
                    title={translate('已达验证次数上限')}
                    msg={translate('验证失败次数已达上限，请使用账号与密码进行登录。')}
                    confirm={translate('我知道了')}
                    onConfirm={() => { this.setState({ noLoginMoreTimes: false }) }}
                />
                <Modals
                    modalVisible={noMoreTimes}
                    onlyOkBtn={true}
                    title={translate('已达验证次数上限')}
                    msg={translate('验证失败次数已达上限，请稍后再尝试或使用其他验证方式。')}
                    confirm={translate('我知道了')}
                    onConfirm={() => { this.setState({ noMoreTimes: false }) }}
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
                    // 关闭nevis提示
                    modalVisible={repeatSet}
                    title={translate('检测到重复设置')}
                    msg={translate('一个账号仅能在一个装置上启用验证方式。若您在此装置启用验证方式，请先在原装置上解除绑定，原装置中的相关数据将会被删除。是否要前往启用？')}
                    cancel={'取消'}
                    onCancel={() => { this.setState({ repeatSet: false }) }}
                    confirm={'确认'}
                    onConfirm={() => { this.setState({ repeatSet: false }, () => { Actions.NevisSetting({ enableUse: true }) }) }}
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
                                    <CheckBox
                                        checkBoxColor={"#c3c3c3"}
                                        checkedCheckBoxColor={"#00E62E"}
                                        onClick={() => {
                                            this.setState({
                                                checkBox: !checkBox,
                                            })
                                        }}
                                        checkedImage={
                                            <Image source={ImgIcon['checkIcon']} style={{ width: 20, height: 20 }} />
                                        }
                                        unCheckedImage={
                                            <Image source={ImgIcon['uncheckIcon']} style={{ width: 20, height: 20 }} />
                                        }
                                        isChecked={this.state.checkBox}
                                        rightTextView={<Text style={{ color: "#fff", marginLeft: 5 }}> {translate('{X} 天内不再显示', { X: nevisSetupReminderDays })}</Text>}
                                    />
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
