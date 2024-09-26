import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from "react-native";
import { decodePayload } from './nevis/userInteraction/OutOfBandOperationHandler';
import useAuthCloudApiRegistrationViewModel from './nevis/screens/AuthCloudApiRegistrationViewModel'
import HomeViewModel from './nevis/screens/HomeViewModel'
import { getConfig } from '$Nevis/config'
import translate from '$Nevis/translate'
import ImgIcon from '$NevisStyles/imgs/ImgIcon'

export const allTypeId = {
    'F1D0#0001': 'Pin',
    'F1D0#1001': 'Pin',//ios
    'F1D0#0002': 'Fingerprint',
    'F1D0#1002': 'Fingerprint',//ios
    // 'F1D0#0003': 'Face',//android 移除，很多设备不支持
    'F1D0#1003': 'Face',//ios
}

export const NevisListData = {
    Face: {
        icon: ImgIcon['faceIcon'],
        name: '人脸识别',
    },
    Fingerprint: {
        icon: ImgIcon['fingerIcon'],
        name: '指纹识别'
    },
    Pin: {
        icon: ImgIcon['pinIcon'],
        name: 'PIN 码识别'
    }
}

const InitClient = ({ init }) => {
    const { initClient, localAccountsVerify, deleteLocalAuthenticators } = HomeViewModel();
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
    window.NevisVerify = (callback = () => { }) => {
        localAccountsVerify(callback)
    }
    //删除
    window.NevisRemoveNevis = (callback = () => { }) => {
        deleteLocalAuthenticators(callback)
    }
    //注册开启nevis
    window.NevisRegistration = (appLinkUri = '', callback = () => { }) => {
        registration(appLinkUri, callback).then()
    }
    //登录验证
    window.NevisLoginVerify = (appLink = '', callback = () => { }) => {
        decodePayload(appLink, callback).catch(() => {})
    }

    return <></>;
};
export default InitClient

//
export const NevisErrs = (res, mode) => {
    const { type, description } = res.errorCode || {}
    if(type == 'USER_LOCKOUT') {
        //次数上限，锁定
        window.onModal('noMoreTimes', true)
    } else if(type == 'USER_CANCELED') {
        //用户取消了
    } else if(type == 'AUTHENTICATOR_ACCESS_DENIED' || type == 'AUTHENTICATOR_ACCESS_DENIED'  || type == 'NO_SUITABLE_AUTHENTICATOR') {
        //卸载后重新安装，无法使用，删除nevis，再重新创建注册
        window.onModal('uninstall', true, {mode: mode})
        NevisRemove()
    } else if(type == 'USER_NOT_ENROLLED') {
        //指纹/脸部辨识未开启
        window.onModal(mode == 'Face'? 'faceEnabled': 'fingerprintEnabled', true)
    } else {
        //其他错误处理
        alert(description + '==>type=' + type)
    }
    window.ChangeNevisSelectAaid = ''
}

//获取全部能用的无密码登录方式。符合条件
export const GetInitModeType = (res) => {
    let allModeType = []
    res.forEach((v) => {
        const active = (v.isSupportedByHardware && allTypeId[v.aaid]) || false
        active && allModeType.push({
            mode: active,
            aaid: v.aaid,
        })
    })
    //排序Face>Fingerprint>Pin
    const sortOrder = ['Face', 'Fingerprint', 'Pin'];
    const newAllMode = allModeType.sort((a, b) => {
        return sortOrder.indexOf(a.mode) - sortOrder.indexOf(b.mode);
    });
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
    if(window.ChangeNevisSelectAaid) {
        //如果是更改，重新设置NevisSelectAaid
        window.NevisSelectAaid = window.ChangeNevisSelectAaid
        window.ChangeNevisSelectAaid = ''
    }
    global.storage.save({
        key: 'NevisSelectAaid',
        id: 'NevisSelectAaid',
        data: window.NevisSelectAaid,
        expires: null
    });
}

//检查当前是否设置无密码登录，如果有设置过，找本地缓存确定是哪个aaid，可能有多个aaid，只使用缓存中的aaid
export const GetModeType = (res) => {
    //是否已经添加
    const actives = res.find((v) => { return (v.registration?.registeredAccounts?.length > 0) }) || false

    if (actives) {
        window.NevisUserName = actives?.registration?.registeredAccounts[0]?.username || ''
        //无密码登录aaid
        global.storage.load({
            key: 'NevisSelectAaid',
            id: 'NevisSelectAaid'
        }).then(res => {
            window.NevisSelectAaid = res || ''
            window.NevisModeType = allTypeId[res] || ''

            //无密码登录NevisUsername
            global.storage.load({
                key: 'NevisUsername',
                id: 'NevisUsername'
            }).then(res => {
                window.NevisUsername = res
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
    put(ApiLink.PUTEnroll + 'authenticatorId=' + window.AuthenticatorId + '&')
        .then((res) => {
            console.log(res)
        })
        .catch((error) => {
            console.log(error)
        })
        //删除手机数据
        window.NevisRemoveNevis((res) => {
            if(res.isSuccess) {
                //删除成功
                window.NevisInitClient()
                callback()
                window.NevisModeType = ''
                window.NevisUsername = ''
                window.NevisSelectAaid = ''
                window.AuthenticatorId = ''
                window.NevisUserName = ''
                global.storage.remove({
                    key: 'NevisSelectAaid',
                    id: 'NevisSelectAaid'
                })
                global.storage.remove({
                    key: 'NevisUsername',
                    id: 'NevisUsername'
                })
                global.storage.remove({
                    key: 'NevisSelectAaid',
                    id: 'NevisSelectAaid'
                })
            } else {
                alert(translate('出现错误，请重试'))
            }

        })
}