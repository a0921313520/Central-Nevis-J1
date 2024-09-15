import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from "react-native";
import { decodePayload } from './nevis/userInteraction/OutOfBandOperationHandler';
import useAuthCloudApiRegistrationViewModel from './nevis/screens/AuthCloudApiRegistrationViewModel'
import HomeViewModel from './nevis/screens/HomeViewModel'
import ImgIcon from '$NevisStyles/imgs/ImgIcon'

export const allTypeId = {
    'F1D0#0001': 'Pin',
    'F1D0#1001': 'Pin',//ios
    'F1D0#0002': 'Fingerprint',
    'F1D0#1002': 'Fingerprint',//ios
    'F1D0#0003': 'Face',
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

    //删除前验证
    window.NevisRemovelVerify = (callback = () => { }) => {
        localAccountsVerify(callback)
    }
    //验证成功后删除
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

    window.NevisAllModeType = allModeType
    GetModeType(res)
}

//检查当前是否设置无密码登录，如果有设置过，找到modeType='Face/Pin/Fingerprint'
export const GetModeType = (res) => {
    //是否已经添加
    actives = res.find((v) => { return (v.registration?.registeredAccounts?.length > 0) }) || false
    window.NevisModeType = actives && allTypeId[actives.aaid] || ''
    if (window.NevisModeType) {
        //没有无密码登录不显示NevisUsername
        global.storage.load({
            key: 'NevisUsername',
            id: 'NevisUsername'
        }).then(res => {
            window.NevisUsername = res
        }).catch(err => { })
    }
}