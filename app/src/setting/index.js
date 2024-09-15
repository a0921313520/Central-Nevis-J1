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
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
    //api获取appLinkUri，去注册开启nevis
    getEnroll = () => {
        const { get } = getConfig()
        NToast.loading(translate('Loading...'), 200)
        get(ApiLink.GETEnroll)
            .then((res) => {
                NToast.removeAll()
                if (res?.isSuccess && res?.result?.appLinkUri) {
                    window.NevisRegistration(res.result.appLinkUri, this.onRegistration)
                } else {
                    const errMessage = res?.errors[0]?.description || res?.errors[0]?.message
                    NToast.fail(errMessage)
                }
            })
            .catch((error) => {

            })
    }
    PUTEnroll = () => {
        const { put } = getConfig()
        let data = {
            authenticatorId: '4aa572dc-0a7b-4b72-b7f3-2c1c50b0a707'
        }
        put(ApiLink.PUTEnroll + 'authenticatorId=' + data.authenticatorId + '&')
            .then((res) => {

            })
            .catch((error) => {

            })
    }
    onRegistration = (res = {}) => {
        const { selectMode } = this.state
        if (res.isSuccess) {
            //开启成功
            window.NevisInitClient()
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

    changeMode = (mode = '', aaid) => {
        const { activeOpen, enableUse } = this.state
        if (activeOpen == mode) {
            // 已开启，点击后提示关闭
            this.setState({ removeModal: mode })
            window.PinIsSet = false
        } else if (activeOpen) {
            // 已开启，点击更换

        } else {
            // 未开启，点击打开
            if(enableUse) { return }//其他手机已绑定设置
            this.setState({ selectMode: mode })
            window.NevisSelectAaid = aaid
            window.PinIsSet = true
        }
    }
    //删除验证,验证成功后才能删除
    removeVerify = () => {
        this.setState({ removeModal: '' })
        window.NevisRemovelVerify(this.removeVerifySuccess)
    }
    //删除验证成功
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
        this.setState({ selectMode: '', onSuccess: false })
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
        } = this.state


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

