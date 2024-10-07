import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity } from "react-native";
import Touch from 'react-native-touch-once';
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import styles from '$NevisStyles/LoginComponent'
import { Actions } from "react-native-router-flux";
import { NevisListData, NevisErrs } from '../InitClient'
import { getConfig } from '$Nevis/config'
import translate from '$Nevis/translate'

//点击扫描icon
export const ScanQRCode = () => {
    if(ApiPort.UserLogin) {
        Actions.ScanQRCode()
        return
    }
    window.NevisVerify((res = {}) => {
        if(res.isSuccess) {
            Actions.ScanQRCode()
        } else {
            NevisErrs(res, window.NevisModeType)
        }
    }, window.NevisModeType)
}

export const ScanIcon = (props) => {
    useEffect(() => {

    }, []);
    let isShow = false
    if(ApiPort.UserLogin) {
        //登录，个人中心,其他账户登录不显示
        isShow = window.NevisUsername && window.NevisUsername == window.userNameDB
    } else {
        isShow = window.NevisModeType
    }
    return (
        isShow ?
            <Touch onPress={() => { ScanQRCode() }}>
                <Image
                    resizeMode="stretch"
                    source={ImgIcon['scanIcon']}
                    style={[styles.scanIcon]}
                />
            </Touch>
            :<View style={{width: 40, height: 40}} />
    )
};

export const NevisLoginIcon = ({ }) => {
    useEffect(() => {

    }, []);


    return (
        window.NevisModeType ?
            <Touch style={styles.nevisLogin} onPress={() => { Actions.NevisLogin({ login: true }) }}>
                <Image
                    resizeMode="stretch"
                    source={NevisListData[window.NevisModeType].icon}
                    style={styles.nevisLoginIcon}
                />
                <Text style={styles.userName}>{window.NevisUsername}</Text>
            </Touch>
            :
            <View style={{height: 70, width: 20,}} />
    )
};


