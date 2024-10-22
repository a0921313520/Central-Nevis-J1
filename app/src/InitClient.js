import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Platform, Alert, Linking } from "react-native";
import { decodePayload } from './nevis/userInteraction/OutOfBandOperationHandler';
import useAuthCloudApiRegistrationViewModel from './nevis/screens/AuthCloudApiRegistrationViewModel'
import HomeViewModel from './nevis/screens/HomeViewModel'
import { getConfig } from '$Nevis/config'
import translate from '$Nevis/translate'
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import FingerprintScanner from "react-native-fingerprint-scanner";
import { Actions } from 'react-native-router-flux';

const androidMode = {
    'F1D0#0001': 'Pin',
    // 'F1D0#0002': 'Fingerprint',
    'F1D0#0003': 'Fingerprint',
}
const iosMode = {
    'F1D0#1001': 'Pin',
    'F1D0#1002': 'Fingerprint',
    'F1D0#1003': 'Face',
}
export const allTypeId = Platform.OS == 'ios'? iosMode: androidMode

export const NevisListData = {
    Face: {
        icon: ImgIcon['LoginFace'],
        name: '人脸识别',
    },
    Fingerprint: {
        icon: ImgIcon['LoginFinger'],
        name: '指纹识别'
    },
    Pin: {
        icon: ImgIcon['LoginPin'],
        name: 'PIN 码识别'
    }
}

const InitClient = ({ init }) => {
    const { initClient, localAccountsVerify, deleteLocalAuthenticators, pinChange } = HomeViewModel();
    const onInitClient = useCallback(async () => { await initClient() }, []);
    const { confirm } = useAuthCloudApiRegistrationViewModel()
    const registration = useCallback(async (appLinkUri, callback) => {
        await confirm(appLinkUri ,callback);
    }, []);

    useEffect(() => {

    }, [init]);

    window.NevisInitClient = () => {
        //初始化
        onInitClient()
            .then((url) => {
                console.log('urlurl11111', url)
            })
    }

    //本地验证
    window.NevisVerify = (callback = () => { }, mode = '') => {
        window.NevisModeChange = mode
        sensorLock(() => {
            loading()
            localAccountsVerify(callback)
        })
    }
    //删除
    window.NevisRemoveNevis = (callback = () => { }) => {
        deleteLocalAuthenticators(callback)
    }
    //注册开启nevis
    window.NevisRegistration = (appLinkUri = '', callback = () => { }, mode = '') => {
        window.NevisModeChange = mode
        sensorLock(() => {
            loading()
            registration(appLinkUri, callback).then()
        })
    }
    //登录验证
    window.NevisLoginVerify = (appLink = '', callback = () => { }, mode = '') => {
        window.NevisModeChange = mode
        sensorLock(() => {
            loading()
            decodePayload(appLink, callback).catch(() => {})
        })
    }
    //设置过pin，切换变成更换pin
    window.NevisChangePin = (callback = () => { }) => {
        window.NevisModeChange = 'Pin'
        sensorLock(() => {
            pinChange(callback)
        })
    }

    const loading = (mode) => {
        NToast.loading(translate('加载中...'), 200)
    }

    const sensorLock = (callback = () => {}) => {
        global.storage.load({
            key: 'NevisLock',
            id: 'NevisLock'
        }).then(res => {
            NToast.removeAll()
            window.onModal('noMoreTimes', true)
        }).catch(err => {
            if(Platform.OS == 'ios') {
                //ios如果被锁定，要密码解锁
                global.storage.load({
                    key: 'NevisLockPassword',
                    id: 'NevisLockPassword'
                }).then(res => {
                    NToast.removeAll()
                    const devices = window.NevisModeChange == 'Face'? '面容ID与密码': '触控ID与密码'
                    Alert.alert(translate('已达验证次数上限'), translate(`开启iPhone “设置 - ${devices}”，验证设备密码，恢复使用`), [
                        {
                            text: translate('取消'),
                            onPress: () => { }
                        },
                        {
                            text: translate('确认'), onPress: () => {
                                Linking.openURL('App-Prefs://') .catch(() => {
                                    Linking.openURL('app-settings:')
                                })
                                global.storage.remove({
                                    key: 'NevisLockPassword',
                                    id: 'NevisLockPassword'
                                })
                            }
                        },
                    ])
                }).catch(err => {
                    callback()
                })
            } else {
                callback()
            }
        })
    }

    return <></>;
};
export default InitClient

export const PhoneSensorAvailable = () => {
    FingerprintScanner
    .isSensorAvailable()
    .then(biometryType => {
        window.SensorAvailable = true
    })
    .catch(err => {
        window.SensorAvailable = false
    })
}

//错误处理
export const NevisErrs = (res, mode) => {
    NToast.removeAll()
    const { type, description } = res?.errorCode || {}
    // alert('test 请忽视' + type)
    if(type == 'USER_LOCKOUT') {
        //次数上限，锁定
        NevisLock()
    } else if(type == 'USER_CANCELED') {
        //用户取消了
    } else if(
        type == 'NO_SUITABLE_AUTHENTICATOR' ||
        type == 'KEY_DISAPPEARED_PERMANENTLY' ||
        type == 'INVALID_TRANSACTION_CONTENT'
    ) {
        //无法使用，删除nevis，再重新创建注册
        window.onModal('uninstall', true, {mode: mode})
        NevisRemove()
        Actions.pop()
    } else if(type == 'USER_NOT_ENROLLED') {
        //指纹/脸部辨识未开启
        window.onModal(mode == 'Face'? 'faceEnabled': 'fingerprintEnabled', true)
        PhoneSensorAvailable()
    } else if(type == 'USER_CANCELLED' || type == 'UNTRUSTED_FACET_ID') {
        //用户取消了
        if(window.ActivePin) {
            Actions.pop()
        }
    } else if(type == 'PROTOCOL_ERROR' || type == 'USER_NOT_RESPONSIVE') {
        //超时了
        window.onModal('timeoutModal', true)
        Actions.pop()
    } else if(type == 'AUTHENTICATOR_ACCESS_DENIED') {
        
        // if(Platform.OS == 'ios') {
        //     NevisLock()
        // }
    } else if(type == 'UNKNOWN') {
        //未知错误，请重试
        // alert('未知错误，请重试')
    } else {
        //其他错误处理
        if(description) {
            alert(description + '==>type=' + type)
        }
    }
}

const NevisLock = () => {
    window.onModal('noMoreTimes', true)
    global.storage.save({
        key: 'NevisLock',
        id: 'NevisLock',
        data: true,
        expires: 5 * 60 * 1000//5分钟
    })
    if(Platform.OS == 'ios' && window.NevisModeChange != 'Pin') {
        global.storage.save({
            key: 'NevisLockPassword',
            id: 'NevisLockPassword',
            data: true,
            expires: null
        })
    }
}

//获取全部能用的无密码登录方式。符合条件
export const GetInitModeType = (res) => {
    let allModeType = []
    res.forEach((v) => {
        const active = (v.isSupportedByHardware && allTypeId[v.aaid]) || false
        active && allModeType.push({
            mode: active,
            aaid: v.aaid,
            registration: v.registration?.registeredAccounts
        })
    })
    //排序Face>Fingerprint>Pin
    const sortOrder = ['Face', 'Fingerprint', 'Pin'];
    const newAllMode = allModeType.sort((a, b) => {
        return sortOrder.indexOf(a.mode) - sortOrder.indexOf(b.mode);
    });
    console.log('newAllModenewAllMode',newAllMode)
    window.NevisAllModeType = newAllMode
    GetModeType(res)
}

export const SetNevisSuccess = () => {
    //设置成功, 添加缓存信息
    global.storage.save({
        key: 'NevisUsername',
        id: 'NevisUsername',
        data: window.userNameDB,
        expires: null
    });
    window.NevisModeType = window.NevisModeChange
    window.NevisModeChange = ''
    global.storage.save({
        key: 'NevisModeType',
        id: 'NevisModeType',
        data: window.NevisModeType,
        expires: null
    });
}

//检查当前是否设置无密码登录，如果有设置过，找本地缓存确定是哪个aaid，可能有多个aaid，只使用缓存中的aaid
export const GetModeType = (res) => {
    //是否已经添加
    const actives = res.find((v) => { return (v.registration?.registeredAccounts?.length > 0) }) || false

    if (actives && window.NevisEnabled) {
        window.NevisRegistrationUserName = actives?.registration?.registeredAccounts[0]?.username || ''

        global.storage.load({
            key: 'NevisModeType',
            id: 'NevisModeType'
        }).then(val => {
            window.NevisModeType = val || ''
            //无密码登录NevisUsername
            global.storage.load({
                key: 'NevisUsername',
                id: 'NevisUsername'
            }).then(i => {
                window.NevisUsername = i
                if(!ApiPort.UserLogin) {
                    setTimeout(() => {
                        //延迟确保进入login
                        window.LoginRefresh(false)
                        Actions.NevisLogin()
                    }, 1000);
                }
            }).catch(err => { })

        }).catch(err => {
            //本地有nevis，但是没有缓存，表示卸载后重新安装，需要移除
        })
    }
}

//删除后清楚数据
export const NevisRemove = (callback = () => {}) => {
    const { put } = getConfig()
    //api删除后台数据
    window.AuthenticatorId.forEach((v) => {
        put(ApiLink.PUTEnroll + 'authenticatorId=' + v.authenticatorId + '&')
        .then((res) => {
            console.log(res)
        })
        .catch((error) => {
            console.log(error)
        })
    })
        //删除手机数据
        window.NevisRemoveNevis((res) => {
            NToast.removeAll()
            if(res.isSuccess) {
                //删除成功
                window.NevisInitClient()
                callback()
                window.NevisModeType = ''
                window.NevisUsername = ''
                window.NevisModeChange = ''
                window.AuthenticatorId = []
                window.NevisRegistrationUserName = ''
                global.storage.remove({
                    key: 'NevisModeType',
                    id: 'NevisModeType'
                })
                global.storage.remove({
                    key: 'NevisUsername',
                    id: 'NevisUsername'
                })
                global.storage.remove({
                    key: 'NevisLock',
                    id: 'NevisLock'
                })
            } else {
                alert(translate('出现错误，请重试'))
            }

        })
}
//获取aaid
export const NevisAaid = (mode = '') => {
    var aaid = Object.entries(allTypeId).find(([key, value]) => value == mode)?.[0] || ''

    return aaid
}