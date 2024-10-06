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
    const { isIphone14Upper = false } = props;
    if (typeof isIphone14Upper !== 'boolean' || typeof isIphone12Upper !== 'boolean' ) {
        console.warn('isIphone14Upper should be a boolean value');
        return null;
    } 
    return (
        window.NevisModeType ?
            <Touch onPress={() => { ScanQRCode() }}>
                <Image
                    resizeMode="stretch"
                    source={ImgIcon['scanIcon']}
                    style={[styles.scanIcon]}
                />
            </Touch>
            :<View />
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
            <></>
    )
};


