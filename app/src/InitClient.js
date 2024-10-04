import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Platform } from "react-native";
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
    'F1D0#0002': 'Fingerprint',
    // 'F1D0#0003': 'Face',//android 移除，很多设备不支持
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
        //初始化
        // onInitClient()
        //     .then((url) => {
        //         console.log('urlurl11111', url)
        //     })

        setTimeout(() => {
            //applink 注册
            // registration().then()
        }, 3000);

        setTimeout(() => {
            //删除
            // deleteLocalAuthenticators()
        }, 2000);

        setTimeout(() => {
            //验证
            // decodePayload('eyJubWFfZGF0YSI6eyJ0b2tlbiI6ImEyYmQ4OTFkLTQ3YzgtNGU3OC04M2U5LTJlNDM1ZmE1OGYzOSIsInJlZGVlbV91cmwiOiJodHRwczovL29nYXV0aC04NTJlZWEubWF1dGgubmV2aXMuY2xvdWQvX2FwcC90b2tlbi9yZWRlZW0vYXV0aGVudGljYXRpb24iLCJjb3JyZWxhdGlvbklkIjoiMTAyMTIwMzQtMjc5OS00NmZiLThhMGUtMTMyMTA1NmFmODNlIn0sIm5tYV9kYXRhX2NvbnRlbnRfdHlwZSI6ImFwcGxpY2F0aW9uL2pzb24iLCJubWFfZGF0YV92ZXJzaW9uIjoiMSJ9').catch((err) => {
            //     console.log('errerrerrerrerr', err)
            // });
        }, 3000);

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
        sensorLock(() => {
            window.NevisModeChange = mode
            loading(mode)
            localAccountsVerify(callback)
        })
    }
    //删除
    window.NevisRemoveNevis = (callback = () => { }) => {
        deleteLocalAuthenticators(callback)
    }
    //注册开启nevis
    window.NevisRegistration = (appLinkUri = '', callback = () => { }, mode = '') => {
        sensorLock(() => {
            window.NevisModeChange = mode
            loading(mode)
            registration(appLinkUri, callback).then()
        })
    }
    //登录验证
    window.NevisLoginVerify = (appLink = '', callback = () => { }, mode = '') => {
        sensorLock(() => {
            window.NevisModeChange = mode
            loading(mode)
            decodePayload(appLink, callback).catch(() => {})
        })
    }
    //设置过pin，切换变成更换pin
    window.NevisChangePin = (callback = () => { }) => {
        sensorLock(() => {
            window.NevisModeChange = 'Pin'
            pinChange(callback)
        })
    }

    const loading = (mode) => {
        NToast.loading(translate('Loading...'), 200)
        mode != 'Pin' && window.onModal('sensorModal', true)
    }

    const sensorLock = (callback = () => {}) => {
        NToast.removeAll()
        global.storage.load({
            key: 'NevisLock',
            id: 'NevisLock'
        }).then(res => {
            window.onModal('noMoreTimes', true)
        }).catch(err => { 
            callback()
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
    const { type, description } = res?.errorCode || {}
    if(type == 'USER_LOCKOUT') {
        //次数上限，锁定
        window.onModal('noMoreTimes', true)
        global.storage.save({
            key: 'NevisLock',
            id: 'NevisLock',
            data: true,
            expires: 5 * 60 * 1000//5分钟
        })
    } else if(type == 'USER_CANCELED') {
        //用户取消了
    } else if(
        type == 'AUTHENTICATOR_ACCESS_DENIED' ||
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
    } else {
        //其他错误处理
        if(description) {
            alert(description + '==>type=' + type)
        }
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

    if (actives) {
        window.NevisRegistrationUserName = actives?.registration?.registeredAccounts[0]?.username || ''
        //无密码登录
        global.storage.load({
            key: 'NevisSelectAaid',
            id: 'NevisSelectAaid'
        }).then(val => {
            window.NevisModeType = allTypeId[val] || ''
            //无密码登录NevisUsername
            global.storage.load({
                key: 'NevisUsername',
                id: 'NevisUsername'
            }).then(i => {
                window.NevisUsername = i
            }).catch(err => { })
            global.storage.remove({
                key: 'NevisSelectAaid',
                id: 'NevisSelectAaid'
            })
        }).catch(err => {
            //本地有nevis，但是没有缓存，表示卸载后重新安装，需要移除
        })

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
                    Actions.pop()
                    Actions.NevisLogin()
                }
            }).catch(err => { })

        }).catch(err => {
            //本地有nevis，但是没有缓存，表示卸载后重新安装，需要移除
        })
    }
    if(!ApiPort.UserLogin) {
        Actions.logins()
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