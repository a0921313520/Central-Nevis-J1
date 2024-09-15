import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image } from "react-native";
import Touch from 'react-native-touch-once';
import ImgIcon from '$NevisStyles/imgs/ImgIcon'
import styles from '$NevisStyles/LoginComponent'
import { Actions } from "react-native-router-flux";
import { NevisListData } from '../InitClient'

export const ScanIcon = ({ backClick = () => { } }) => {
    useEffect(() => {

    }, []);

    return (
        window.NevisModeType ?
            <Touch onPress={() => { Actions.ScanQRCode() }}>
                <Image
                    resizeMode="stretch"
                    source={ImgIcon['scanIcon']}
                    style={styles.scanIcon}
                />
            </Touch>
            :
            <Touch onPress={backClick}>
                <Image
                    resizeMode="stretch"
                    source={ImgIcon['icon-back']}
                    style={styles.scanIcon}
                />
            </Touch>
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

